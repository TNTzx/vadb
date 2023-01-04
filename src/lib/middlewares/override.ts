import Logger from "../util/Logger";
import express from "express";
import { PrismaClient } from "@prisma/client";



export type ExtendedReq = express.Request & {
    expect: (header: string, expected: string) => void;
    validate: () => Promise<boolean>;
};

export type ExtendedRes = express.Response & {
    code: (code: number, data: any) => void;
    message: (
        code: number,
        message: {
            message: string,
            data?: any
        }
    ) => void;
};



export default (req: ExtendedReq, res: ExtendedRes, next: express.NextFunction) => {
    // RESPONSES //
    res.code = (code, data) => {
        return res.status(code).json(
            {code, data}
        );
    }

    res.message = (code, message) => {
        return res.status(code).json(
            {code, message}
        );
    }


    // REQUESTS //
    req.expect = (header, expected) => {
        let result = false;

        if (req.headers[header] === undefined) {
            Logger.Error(`No header with "${header}" exists.`);
            res.message(500, {message: "Something went wrong on the server."})
        }

        for (const exp of expected) {
            if (req.headers[header].includes(exp))
                result = true;
        }

        if (!result) {
            res.message(400, {
                message: "A header in the request was malformed and couldn't be processed.",
                data: {
                    expected
                }
            })
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

            let token = req.headers["authorization"].slice(Config["auth_header"].length);
            let access = await global.Prisma.token.findFirst({
                where: { token: token }
            });

            return access !== null;
        }

        return false;
    }

    next();
}