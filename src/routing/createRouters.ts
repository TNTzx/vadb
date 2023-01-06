import teapot from "./routers/teapot"
import artist from "./routers/artist";



export default () => {
    return [
        teapot(),
        artist()
    ];
}