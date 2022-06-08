module.exports = (req, res, next) => {
    // RESPONSES //
    res.code = (code, data) => {
        return res.status(code).json({
            code,
            data
        });
    }

    res.message = (code, message) => {
        return res.status(code).json({
            code,
            ...message
        });
    }

    // REQUESTS //
    req.expect = (header, expected) => {
        let result = false;

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
            let access = await Prisma.token.findFirst({
                where: { token: req.cookies.access }
            });

            return access !== null;
        } else if (req.headers["authorization"]) {
            if (!req.headers["authorization"].startsWith(Config["auth_header"]))
                return false;

            let token = req.headers["authorization"].slice(Config["auth_header"].length);
            let access = await Prisma.token.findFirst({
                where: { token: token }
            });

            return access !== null;
        }

        return false;
    }

    next();
}