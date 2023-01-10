import Logger from "../logger";
import express from "express";



export type ExtendedReq = express.Request & {
    expect: (header: string, expected: string[]) => boolean;
    validate: () => Promise<boolean>;
};

export type ExtendedRes = express.Response & {
    code: (code: number, data: any) => void;
    message: (
        code: number,
        message: string,
        data?: any
    ) => void;
};



export default function expressMidware(req: ExtendedReq, res: ExtendedRes, next: express.NextFunction) {
    // RESPONSES //
    res.code = (code, data) => {
        return res.status(code).json(
            {code, data}
        );
    }

    res.message = (code, message, data?) => {
        return res.status(code).json(
            data ? {code, message, data} : {code, message}
        );
    }


    // REQUESTS //
    req.expect = (header, expected) => {
        let result = false;

        if (req.headers[header] === undefined) {
            Logger.Error(`No header with "${header}" exists.`);
            res.message(500, "Something went wrong on the server.")
        }

        for (const exp of expected) {
            if (req.headers[header].includes(exp))
                result = true;
        }

        if (!result) {
            res.message(400, "A header in the request was malformed and couldn't be processed.", expected)
        }

        return result;
    }

    req.validate = async () => {
        if (req.cookies.access) {
            let access = await global.Prisma.token.findFirst({
                where: { token: req.cookies.access }
            });

            return access !== null;
        } else if (req.headers["authorization"]) {
            if (!req.headers["authorization"].startsWith(Config["auth_header"]))
                return false;

            let token = req.headers["authorization"].slice(Config["auth_header"].length + 1);
            let access = await global.Prisma.token.findFirst({
                where: { token: token }
            });

            return access !== null;
        }

        return false;
    }

    next();
}