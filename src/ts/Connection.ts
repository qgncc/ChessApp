import {v4 as uuid} from 'uuid';
import * as t from './types';


export default function connectionHandler(ws: WebSocket,onConnection: (data: Event)=>void, onMessage: (data: MessageEvent)=>void) {
    let socket = ws
    let roomID:string|undefined;
    let playerColor: t.Color;
    socket.addEventListener("open", onConnection);
    socket.addEventListener("message", onMessage);
    return {
        getRoomID: () => roomID,
        socket: () => socket,
        side: () => playerColor,
        //TODO make it http request(for some reason it seems a better solution then do everything through websocket)
        createRoom: function (side: t.Color) {

            playerColor = side;
            roomID = uuid();
            let options: RequestInit ={
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    type:"create_room",
                    uuid:roomID
                })
            }

            fetch("localhost:8000/create_room",options).then((res)=>{
                if(!res.ok)throw new Error("Connection error"+res.statusText);
                console.log(res.body)
            });
            // socket.send(JSON.stringify({
            //     "type":"create_room",
            //     "side":side,
            //     "roomID": roomID
            //     })
            // );
            return roomID;
        },
        //TODO make it http request(for some reason it seems a better solution then do everything through websocket)
        joinRoom: function (id:string){
            roomID = id
            socket.send(JSON.stringify({
                "type":"join_room",
                "roomID": roomID,
            })
            );
        },
        move: function (move: t.Move){
            if(!roomID) throw new Error("room isn't created")
            socket.send(JSON.stringify({
                    "type":"move",
                    "move":{"from":move.from,"to":move.to,"promotion":move.promotion},
                    "roomID":roomID
                })
            );
        }
    }
}