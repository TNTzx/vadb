/** @module ExpressMiddleware Contains Express middleware. */


import express from "express";
import { StatusCodes } from "http-status-codes";

import Logger from "../logger";



export type ExtendedReq = express.Request & {
    expectHeader: (header: string, expected: string[]) => boolean;
    expectAdmin: () => Promise<boolean>;
};

export type ExtendedRes = express.Response & {
    addMessage: (
        code: number,
        message: string,
        data?: any
    ) => express.Response;
};



export default function expressMidware(req: ExtendedReq, res: ExtendedRes, next: express.NextFunction) {
    res.addMessage = (code, message, data?) => {
        let output: {code: number, message?: string, data?: {}} = {code: code}

        if (message) output.message = message;
        if (data) output.data = data

        return res.status(code).json(output);
    }


    // REQUESTS //
    req.expectHeader = (header, expected) => {
        if (req.headers[header] === undefined) {
            Logger.Error(`No header with "${header}" exists.`);
            res.addMessage(500, "Something went wrong on the server.")
        }

        for (const exp of expected) {
            if (req.headers[header].includes(exp))
                return true;
        }

        res.addMessage(400, "A header in the request was malformed and couldn't be processed.", expected)
    }

    req.expectAdmin = async () => {
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