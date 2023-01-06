import teapot from "./routers/teapot"
import artist from "./routers/artist";



export default function makeRouterInfos() {
    return [
        teapot(),
        artist()
    ];
}