// define variables size calculator

const typeMessageField = document.querySelector(
  ".modal-size-tabel_advice-paragrapth"
);
const typeMessage = [
  "Selezionando l'opzione 'Stretto', il capo ti vestirà attillato.",
  "Selezionando l'opzione 'Comodo', il capo ti vestirà giusto.",
  "Selezionando l'opzione 'Largo', il capo ti vestià abbondante/oversize.",
];
let sizes = ["S", "M", "L", "XL"];
const sizeRenderField = document.querySelector(".modal-size-tabel_size-render");

let heightField = document.querySelector(".input-heigth");
let weightField = document.querySelector(".input-weigth");

let heigh = 145;
let weight = 40;
let sizeMessage = "Ti consigliamo la taglia: ";

let selectForm = document.querySelector(".modal-size-tabel__select");
let selectValue = 0;

// event listeners calculator

heightField.addEventListener("change", distributeSizes);
heightField.addEventListener("keydown", prevenNumberImput);

weightField.addEventListener("change", distributeSizes);
weightField.addEventListener("keydown", prevenNumberImputW);
selectForm.addEventListener("change", distributeSizes);
selectForm.addEventListener("change", renderTypeMessage);

// prevent default height
function prevenNumberImput(event) {
  // let regexp = /[ˆ0-9]{3}/gi;
  if (!/\d/.test(event.key) && event.key !== "Backspace") {
    console.log(typeof event.key, event.key + " " + "number");

    event.preventDefault();
  }
  {
    console.log("else number", heightField.value - 10);
  }
}

// prevent default weight

function prevenNumberImputW(event) {
  // let regexp = /[ˆ0-9]{3}/gi;
  if (!/\d/.test(event.key) && event.key !== "Backspace") {
    let char = event.key;
    console.log(char, typeof char);
    console.log(event.key);
    event.preventDefault();
  } else if (/[ˆ0-9]/gi.test(event.key)) {
    console.log("If number 0", typeof event.key);
    let weightValue = Number(weightField.value - 10);
    console.log(weightValue, typeof weightValue);
  } else if (!/[ˆ0-9]/gi.test(event.key)) {
    console.log("If string");
  } else if (/\d/.test(event.key)) {
    console.log("If number /d", typeof event.key);
  }
  console.log("else text");
}
// functions

function renderSizeToDom(a) {
  sizeRenderField.innerHTML = sizeMessage + "" + sizes[a];
  //sizeRenderFieldPage.innerHTML = sizeMessage + "" + sizes[a];
}

function renderTypeMessage() {
  console.log("check");
  if (selectValue === 0) {
    typeMessageField.innerHTML = typeMessage[0];
  } else if (selectValue === 1) {
    typeMessageField.innerHTML = typeMessage[1];
  } else if (selectValue === 2) {
    typeMessageField.innerHTML = typeMessage[2];
  }
}

function distributeSizes() {
  height = Number(heightField.value);
  weight = Number(weightField.value);
  selectValue = Number(selectForm.value);

  //s

  if (
    height >= 145 &&
    height <= 160 &&
    weight >= 40 &&
    weight <= 70 &&
    selectValue === 0
  ) {
    renderSizeToDom(0);
  } //m
  else if (
    height >= 161 &&
    height <= 175 &&
    weight >= 61 &&
    weight <= 70 &&
    selectValue === 1
  ) {
    renderSizeToDom(1);
  }

  //L
  else if (
    height >= 176 &&
    height <= 190 &&
    weight >= 71 &&
    weight <= 85 &&
    selectValue === 1
  ) {
    renderSizeToDom(2);
  } else if (
    height >= 191 &&
    height <= 210 &&
    weight >= 85 &&
    weight <= 120 &&
    selectValue === 0
  ) {
    renderSizeToDom(2);
  }

  //XL
  else if (
    height >= 191 &&
    height <= 210 &&
    weight >= 86 &&
    weight <= 100 &&
    selectValue === 1
  ) {
    renderSizeToDom(3);
  } else {
    sizeRenderField.innerHTML = " Questa misura non e disponibile";
  }
}
