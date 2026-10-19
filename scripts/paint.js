"use-strict"




const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imagetest = new Image();
imagetest.src = "./ressources/img/spray.png"; 
let newimage = null

const inputColor = document.getElementById("input-color");
const inputRouge = document.getElementById("input-rouge");
const inputVert = document.getElementById("input-vert");
const inputBleu = document.getElementById("input-bleu");
const inputTaille = document.getElementById("input-taille");

const buttonRestore = document.getElementById("restore-button");
const buttonClear = document.getElementById("clear-button");



function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener("DOMContentLoaded",ready)

function ready(){
    
}



let addInterval = null;
let lastMouse = {x: 0, y: 0};

let restoreArray = [];
let restoreIndex = -1;



function startdraw(event){
    console.log(inputColor.value)
    //newimage = colorize(imagetest,Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()))
    newimage = colorize(imagetest,inputRouge.value/100,inputVert.value/100,inputBleu.value/100)
    draw();
    if(!addInterval){
        addInterval = setInterval(
            draw,1
        )
    }
}

function draw(){
    // ajouter le dessin ici sur le canvas a la pos event.clientX / event.clientY
    //ctx.drawImage(newimage, lastMouse.x-(25+(inputTaille/2)), lastMouse.y-(25+(inputTaille/2)),50+inputTaille,50+inputTaille);
    ctx.drawImage(newimage, lastMouse.x-(inputTaille.value/2), lastMouse.y-(inputTaille.value/2),inputTaille.value,inputTaille.value);
}

function stopdraw(event){
    if (addInterval) {
        clearInterval(addInterval);
        addInterval = null;
    }
    
    if(event.type != 'mouseout' ){
        restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        restoreIndex+=1;
        console.log(restoreIndex)
        console.log(restoreArray)
    }

}


document.addEventListener("mousedown",startdraw);
document.addEventListener("mousemove",(event)=>{
    const rect = canvas.getBoundingClientRect();
    lastMouse.x = (event.clientX - rect.left);
    lastMouse.y = (event.clientY - rect.top);
});


document.addEventListener('mouseout', stopdraw);
document.addEventListener('mouseup', stopdraw);
document.addEventListener('touchdown', stopdraw);
//document.addEventListener('mouseleave', stopdraw);
//window.addEventListener('mouseup', stopdraw); // au cas où on relâche en dehors du canvas

buttonClear.addEventListener('click',clear);
buttonRestore.addEventListener('click',restore)


function clear(){
    ctx.fillStyle = "#ffffff"
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    restoreArray = [];
    restoreIndex = -1;
}


function restore(){
    if(restoreIndex <= 1 ){
        clear()
    }else{
        restoreIndex-=2;
        console.log(restoreIndex)
        restoreArray.pop();
        restoreArray.pop();
        ctx.putImageData(restoreArray[restoreIndex],0,0);
    }
}


const colorize = (image, r, g, b) => {
  const imageSize = image.width;

  const offscreen = new OffscreenCanvas(imageSize, imageSize);
  const ctx = offscreen.getContext("2d");

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, imageSize, imageSize);

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] *= r;
    imageData.data[i + 1] *= g;
    imageData.data[i + 2] *= b;
  }

  ctx.putImageData(imageData, 0, 0);

  return offscreen;
}