import { RouterInfo } from "../routerInfo"
import { ExtendedReq, ExtendedRes } from "../../lib/middlewares/express";


export default () => {
    var routerInfo = new RouterInfo("/teapot", ["/test", "/cock"]);

    routerInfo.router.all(
        "/",
        (req: ExtendedReq, res: ExtendedRes) => {
            return res.message(418, "I'm a teapot! However, I cannot brew you coffee.");
        }
    );

    return routerInfo
}
