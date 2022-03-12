

export default function renderWaitingScreen() {
    function copyText(e:Event){
        e.preventDefault();
        let text = link_box_input.value;
        navigator.clipboard.writeText(text);
    }

    let black_box = document.createElement("div");
    black_box.className = "black_box";

    let success_message = document.createElement('h1');
    success_message.append("The room has been created! Here is the invitation link: ")

    let link_box = document.createElement("div");
    link_box.className = "link_box"

    // let link_box_span = document.createElement('span');
    // link_box_span.className = "link_box__url"

    let link_box_input = document.createElement('input');
    link_box_input.className = "link_box__url";
    link_box_input.disabled = true;

    let link_box_copy_icon = document.createElement('i');
    link_box_copy_icon.className = "link_box__icon uil uil-copy"

    let copy_button = document.createElement('button');
    copy_button.append(link_box_copy_icon);
    copy_button.className = "link_box__copy_button";
    copy_button.addEventListener("click", copyText);




    let waiting_message = document.createElement('h1');
    waiting_message.append("waiting for second player to connect");

    return{
        render:function (root: HTMLElement, url: string){
            link_box_input.value = url;
            link_box.append(link_box_input,copy_button);
            black_box.append(success_message,link_box,waiting_message);
            root.append(black_box)
        },
        destroy: function (){
            black_box.remove();
        }
    }
}