import 'css/main.scss'
import Controller from './ts/Controller'
import ChessGame from "./ts/ChessGame";


let host = "localhost:8080/";
let root = document.getElementById("wrapper");
if(!root) throw new Error("!root");
let socket = new WebSocket("ws://"+host);
let controller = Controller(socket, host, root);
let uri = trimSlashes(location.pathname).split("/");

socket.addEventListener("open", ()=>{
    if(uri.length === 2 && uri[0] === "room"){
        controller.joinRoom(uri[1])
    }else{
        controller.renderForm();
    }
})
function trimSlashes(str: string) {
    if(str.charAt(0) === "/") str = str.substring(1);
    if(str.charAt(str.length-1) === "/") str = str.substring(0,str.length-1);
    return str;
}

