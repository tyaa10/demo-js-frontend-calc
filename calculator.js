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
let heightChecking = false
let weightChecking = false
let sizeMessage = "Ti consigliamo la taglia: ";

let selectForm = document.querySelector(".modal-size-tabel__select");
let selectValue = 0;

// event listeners calculator

// heightField.addEventListener("change", distributeSizes);
heightField.addEventListener("input", onHeightFieldChaned);
heightField.addEventListener("keydown", preventNonNumericImput);

// weightField.addEventListener("change", distributeSizes);
weightField.addEventListener("input", onWeightFieldChaned)
weightField.addEventListener("keydown", preventNonNumericImput);

selectForm.addEventListener("change", distributeSizes);
selectForm.addEventListener("change", renderTypeMessage);

function isNumberOrBackspace(key) {
  return /[0-9]/.test(key) || key === "Backspace"
}

// prevent default
function preventNonNumericImput(event) {
  if(!isNumberOrBackspace(event.key)) {
    event.preventDefault()
  }
}

function onHeightFieldChaned(event) {
  if (!heightChecking) {
    heightChecking = true
    let height = Number(heightField.value)
    if(height < 145) {
      setTimeout(()=>{
        height = Number(heightField.value)
        if(height < 145) {
          heightField.value = 145
        } else if (height > 210) {
          heightField.value = 210
        }
        heightChecking = false
        distributeSizes()
      }, 3000)
    } else if (height > 210) {
      heightField.value = 210
      heightChecking = false
      distributeSizes()
    } else {
      heightChecking = false
      distributeSizes()
    }
  }
}

function onWeightFieldChaned(event) {
  console.log('weightChecking = ', weightChecking)
  if (!weightChecking) {
    weightChecking = true
    let weight = Number(weightField.value)
    console.log('weight = ', weight)
    if(weight < 40) {
      setTimeout(()=>{
        weight = Number(weightField.value)
        if(weight < 40) {
          weightField.value = 40
        } else if (weight > 120) {
          weightField.value = 120
        }
        weightChecking = false
        distributeSizes()
      }, 3000)
    } else if (weight > 120) {
      weightField.value = 120
      weightChecking = false
      distributeSizes()
    } else {
      weightChecking = false
      distributeSizes()
    }
  }
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
