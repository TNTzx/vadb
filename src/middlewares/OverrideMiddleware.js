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
        for (const exp of expected) {
            if (!req.headers[header].includes(exp)) {
                res.message(400, {
                    message: "A header in the request was malformed and couldn't be processed.",
                    data: {
                        expected
                    }
                });

                return false;
            }
        }

        return true;
    }

    next();
}