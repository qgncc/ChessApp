import 'css/main.scss'
import Controller from './ts/Controller'
import * as t from './ts/types';


let host = "localhost:3000/"
let root = document.getElementById("wrapper");
if(!root) throw new Error("!root");
let controller = Controller(new WebSocket("ws://"+host), host, root);
function trimSlashes(str: string) {
    if(str.charAt(0) === "/") str = str.substring(1);
    if(str.charAt(str.length-1) === "/") str = str.substring(0,str.length-1);
    return str;
}

let uri = trimSlashes(location.pathname).split("/");

if(uri.length === 2 && uri[0] === "room"){
    controller.joinRoom(uri[1])
}else{
    controller.renderForm();
}