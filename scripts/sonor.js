"use-strict"

let width = 24
let height = 12
let canvas = document.getElementById('canvas');

function ready(){
    
    for(let i = 0; i < width; i++){
        const div = document.createElement("div");
        canvas.appendChild(div);
        console.log("test1");
        
        for(let j = 0; j < height; j++){
            const p = document.createElement("p");
            p.textContent = "test"
            div.appendChild(p);
            console.log("test2");
        }
    }
}

document.addEventListener('DOMContentLoaded',ready)

