import * as t from './types';
import '../css/victoryPrompt.scss';



export default function (){
    let wrapper = document.createElement("wrapper");
    wrapper.className = "modal_wrapper";
    wrapper.addEventListener("mousedown", (e)=>e.stopPropagation());

    let div = document.createElement("div");
    div.className = "modal_window victory-window-t";
    let br = document.createElement("br");

    let h1 = document.createElement("h1");
    h1.className = "modal_window__title";


    let button = document.createElement("button");
    button.append("Rematch".toUpperCase());
    button.className = "button modal_window__button ";

    div.append(h1,button);
    wrapper.append(div)
    return{
        element: div,
        button: button,
        render:function (root: HTMLElement,winning_side: t.Color|"draw"){
            let text = winning_side === "w"? "white": "black";
            if(winning_side === "draw"){
                h1.append("draw");
            }else{
                h1.append(text,br," won");
            }
            root.append(wrapper);
        }
    }
}