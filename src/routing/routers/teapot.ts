import { RouterInfo } from "../routerClass"
import { ExtendedReq, ExtendedRes } from "../../lib/middlewares/override";



const routerInfo = new RouterInfo("/teapot", ["/test", "/cock"]);

routerInfo.router.all(
    "/",
    (req: ExtendedReq, res: ExtendedRes) => {
        return res.message(418, {message: "I'm a teapot! However, I cannot brew you coffee."});
    }
);

export default routerInfo;
