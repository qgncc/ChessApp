import '../css/createRoomButton.scss'

export default function createForm  () {
    let form = document.createElement("form");
    form.className = "options";

    let button = document.createElement("button");
    button.id = "createRoom";
    button.className = "button t-button-start margin-15";
    button.append("Create room");

    function destroyForm(){
        let parent = form.parentNode
        if(parent){
            parent.removeChild(form);
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
    });


    return {
        element: form,
        button: button,
        radioList: radios,
        render: (root: HTMLElement) => {
            root.append(form);
        },
        whichChecked: () => whichRadioButtonIsChecked(radios),
        destroy: destroyForm
    };
}
