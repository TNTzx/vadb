import { RouterInfo } from "../routerInfo"
import { ExtendedReq, ExtendedRes } from "../../../middlewares/express";


export default () => {
    var routerInfo = new RouterInfo("/teapot", ["/test", "/cock"]);

    routerInfo.router.all(
        "/",
        (req: ExtendedReq, res: ExtendedRes) => {
            return res.addMessage(418, "I'm a teapot! However, I cannot brew you coffee.");
        }
    );

    return routerInfo
}
