import '../css/CreateForm.scss';

export default function createForm  () {
    let black_box = document.createElement("div");
    black_box.className = "black_box"

    let form = document.createElement("form");
    form.className = "options";

    let button = document.createElement("button");
    button.id = "createRoom";
    button.className = "button button--margin--15 button--corners--rounded";
    button.append("Create room");

    function destroyForm(){
        let parent = black_box.parentNode
        if(parent){
            parent.removeChild(black_box);
        }
    }
    function whichRadioButtonIsChecked(radios:HTMLInputElement[]) {
        for (let i = 0; i < radios.length; i++) {
            if(radios[i].checked) return radios[i].id;
        }
    }


    let options = ["any", "w", "b"];
    let radios:HTMLInputElement[] = [];
    options.forEach((value,index)=>{
        let label = document.createElement("label");
        label.className = "options__option "+ value + (value === "any"?"":"k");
        label.htmlFor = value;

        let input = document.createElement("input");
        if(index === 0) {
            input.checked = true;
        }
        input.type = "radio";
        input.name = "side";
        input.value = value;
        input.id = value;
        radios.push(input);


        form.append(input)
        form.append(label)
        form.append(button)
        black_box.append(form)
    });


    return {
        element: form,
        button: button,
        radioList: radios,
        render: (root: HTMLElement) => {
            root.append(black_box);
        },
        whichChecked: () => whichRadioButtonIsChecked(radios),
        destroy: destroyForm
    };
}
