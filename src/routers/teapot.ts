import Express from "express"
import { ExtendedReq, ExtendedRes } from "../lib/middlewares/override";



const router = Express.Router();

router.all(
    "/",
    (req: ExtendedReq, res: ExtendedRes) => {
        return res.message(418, {message: "I'm a teapot! However, I cannot brew you coffee."});
    }
);

export default router;
export const aliases = ["/test", "/cock"];
