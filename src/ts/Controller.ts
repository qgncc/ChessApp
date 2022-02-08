import ChessGame from './ChessGame';
import createForm from "./CreateForm";
import createWatingScreen from "./crreateWaitingScreen";
import connectionHandler from "./Connection";
import * as t from './types';


export default function Controller(socket: WebSocket,host: string,root: HTMLElement){
    let form = createForm();
    let waitingScreen = createWatingScreen()
    let connection = connectionHandler(socket, onConnection, onMessage);


    function onMessage(event: Event) {
        return;
    }
    function onConnection(event: Event) {
        return;
    }


    function createRoom(){
        let checked = form.whichChecked();
        let uuid = connection.createRoom(checked as t.Color);
        form.destroy();
        waitingScreen.render(root,"http://"+host+"room/"+uuid);
    }
    function joinRoom(uuid: string){
        history.replaceState(null, "Room", "room/"+uuid);
        connection.joinRoom(uuid);
    }
    return{
        renderForm: ()=>{
            form.button.addEventListener("click", createRoom);
            form.render(root);
        },
        waitingScreen:()=>waitingScreen,
        joinRoom: joinRoom,
    }
}