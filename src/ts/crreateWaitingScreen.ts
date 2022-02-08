export default function renderWaitingScreen() {
    let success_message = document.createElement('h1');
    success_message.append("Room has been created! Here is inviting link:")

    let link_message = document.createElement('input');


    let copy_button = document.createElement('button');
    copy_button.value = "Copy";

    let waiting_message = document.createElement('h1');
    waiting_message.append("Waiting for second player to connect");

    let div = document.createElement("div");
    return{
        render:function (root: HTMLElement, url: string){
            link_message.value = url;
            div.append(success_message,link_message,copy_button,waiting_message)
            root.append(div)
        },
        destroy: function (){
            div.remove();
        }
    }
}