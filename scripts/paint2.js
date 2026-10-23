"use-strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gridCanvas = document.getElementById("gridCanvas");
const gridCtx = gridCanvas.getContext("2d");

const imagetest = new Image();
imagetest.src = "./ressources/img/spray.png";
let newimage = null;
/*
const inputColor = document.getElementById("input-color");
const inputRouge = document.getElementById("input-rouge");
const inputVert = document.getElementById("input-vert");
const inputBleu = document.getElementById("input-bleu");
const inputTaille = document.getElementById("input-taille");

const buttonRestore = document.getElementById("restore-button");*/
const effaceurDiv = document.querySelector(".color-effaceur");

let colorR = 1.0;
let colorG = 1.0;
let colorB = 1.0;

let currentTool = "draw";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (gridCanvas && gridCtx) {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
  }
  
  drawGrid();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.addEventListener("DOMContentLoaded", ready);

function ready() {
  const pickers = document.querySelectorAll(".color-picker");

  pickers.forEach((picker) => {
    picker.addEventListener("click", () => {
      pickers.forEach((p) => p.classList.remove("active"));

      picker.classList.add("active");

      if (!picker.classList.contains("color-effaceur")) {
        currentTool = "draw";
      }
    });
  });

  const color_picker_1 = document.getElementById("color-picker-4");
  color_picker_1.addEventListener("click", () => {
    colorR = 255 / 255;
    colorG = 0.0 / 255;
    colorB = 7 / 255;
  });
  const color_picker_2 = document.getElementById("color-picker-1");
  color_picker_2.addEventListener("click", () => {
    colorR = 29 / 255;
    colorG = 176 / 255;
    colorB = 252 / 255;
  });
  const color_picker_3 = document.getElementById("color-picker-2");
  color_picker_3.addEventListener("click", () => {
    colorR = 255 / 255;
    colorG = 119 / 255;
    colorB = 0.0 / 255;
  });
  const color_picker_4 = document.getElementById("color-picker-3");
  color_picker_4.addEventListener("click", () => {
    colorR = 255 / 255;
    colorG = 0.0 / 255;
    colorB = 203 / 255;
  });

  drawGrid();
}

let addInterval = null;
let lastMouse = { x: 0, y: 0 };

let restoreArray = [];
let restoreIndex = -1;

let ArrayImgPos = [];

function startdraw(event) {
  if (
    event.target.closest("#color-control") ||
    event.target.closest(".color-effaceur")
  ) {
    return;
  }

  if (currentTool === "draw") {
    newimage = colorize(imagetest, colorR, colorG, colorB);
  }

  //newimage = colorize(imagetest,Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random()))
  newimage = colorize(imagetest, colorR, colorG, colorB);
  draw();
  if (!addInterval) {
    addInterval = setInterval(draw, 1);
  }
}

function draw() {
  if (currentTool === "erase") {
    ctx.globalCompositeOperation = "destination-out";

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.arc(lastMouse.x, lastMouse.y, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
  } else {
    // ajouter le dessin ici sur le canvas a la pos event.clientX / event.clientY
    //ctx.drawImage(newimage, lastMouse.x-(25+(inputTaille/2)), lastMouse.y-(25+(inputTaille/2)),50+inputTaille,50+inputTaille);
    ctx.drawImage(newimage, lastMouse.x - 50, lastMouse.y - 50, 100, 100);
    ArrayImgPos.push([lastMouse.x - 50, lastMouse.y - 50]);
  }
}

async function stopdraw(event) {
  if (addInterval) {
    clearInterval(addInterval);
    addInterval = null;
  }

  if (event.type != "mouseout") {
    console.log(ArrayImgPos);

    /*restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        restoreIndex+=1;
        console.log(restoreIndex)
        console.log(restoreArray)*/
  }
}

document.addEventListener("mousedown", startdraw);
document.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  lastMouse.x = event.clientX - rect.left;
  lastMouse.y = event.clientY - rect.top;
});

//document.addEventListener('mouseout', stopdraw);
document.addEventListener("mouseup", stopdraw);
document.addEventListener("touchdown", stopdraw);
document.addEventListener("mouseleave", stopdraw);
window.addEventListener("mouseup", stopdraw); // au cas où on relâche en dehors du canvas

if (effaceurDiv) {
  effaceurDiv.addEventListener("click", () => {
    currentTool = "erase";
    document.querySelectorAll(".color-picker").forEach((p) => p.classList.remove("active"));
    effaceurDiv.classList.add("active");
  });

  effaceurDiv.addEventListener("dblclick", clear);
}
/*buttonRestore.addEventListener('click',restore)*/

function drawGrid() {
  const targetCtx = gridCtx || ctx;
  const targetW = gridCanvas ? gridCanvas.width : canvas.width;
  const targetH = gridCanvas ? gridCanvas.height : canvas.height;

  targetCtx.fillStyle = "#ffffff";
  targetCtx.fillRect(0, 0, targetW, targetH);

  targetCtx.strokeStyle = "#e5e5e5";
  targetCtx.lineWidth = 1;

  const step = 40;

  for (let x = 0; x <= targetW; x += step) {
    targetCtx.beginPath();
    targetCtx.moveTo(x, 0);
    targetCtx.lineTo(x, targetH);
    targetCtx.stroke();
  }

  for (let y = 0; y <= targetH; y += step) {
    targetCtx.beginPath();
    targetCtx.moveTo(0, y);
    targetCtx.lineTo(targetW, y);
    targetCtx.stroke();
  }
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ArrayImgPos = [];

  /*restoreArray = [];
    restoreIndex = -1;*/
}

/*
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
}*/

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
};
