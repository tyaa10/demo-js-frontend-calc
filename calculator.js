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

const heightField = document.querySelector(".input-heigth");
const weightField = document.querySelector(".input-weigth");
const pleaseWaitHeader = document.getElementById("please-wait");

const MIN_HEIGHT = 145
const MAX_HEIGHT = 210
const MIN_WEIGHT = 40
const MAX_WEIGHT = 120

const CHECKING_STAGES = {
  ZERO: 0, FIRST: 1, SECOND: 2
}

const TRY_CHANGE_BOUNDES_PLEASE_WAIT_TEXT = "Trying to change ranges ..."

let sizeMessage = "Ti consigliamo la taglia: ";

const selectForm = document.querySelector(".modal-size-tabel__select");
const rangesAvailable = document.getElementById("intervals-available")
// let selectValue = 0;

const fit = {
  slim: 0,
  regular: 1,
  oversize: 2
}

const sizeModels = {
  S: {
    states: [
      {
        minHeight: 145,
        maxHeight: 160,
        minWeight: 40,
        maxWeight: 70,
        fit: fit.slim
      }
    ],
    text: 'S'
  },
  M: {
    states: [
      {
        minHeight: 161,
        maxHeight: 175,
        minWeight: 61,
        maxWeight: 70,
        fit: fit.regular
      }
    ],
    text: 'M'
  },
  L: {
    states: [
      {
        minHeight: 176,
        maxHeight: 190,
        minWeight: 71,
        maxWeight: 85,
        fit: fit.regular
      },
      {
        minHeight: 191,
        maxHeight: 210,
        minWeight: 85,
        maxWeight: 120,
        fit: fit.slim
      }
    ],
    text: 'L'
  },
  XL: {
    states: [
      {
        minHeight: 191,
        maxHeight: 210,
        minWeight: 86,
        maxWeight: 100,
        fit: fit.regular
      }
    ],
    text: 'XL'
  },
  NoSize: {
    states: [],
    text: ' Questa misura non e disponibile'
  }
}

const state = {
  startHeight: 145,
  startWeight: 40,
  fit: fit.slim,
  size: sizeModels.S,
  currentMinHeight: MIN_HEIGHT,
  currentMaxHeight: MAX_HEIGHT,
  currentMinWeight: MIN_WEIGHT,
  currentMaxWeight: MAX_WEIGHT,
  heightChecking: false,
  weightChecking: false,
  checkingStage: CHECKING_STAGES.SECOND,
  rangesChangedAutomatically: false
}

heightField.value = state.startHeight
weightField.value = state.startWeight

distributeSizes()

function calcHeightBounds(weight, fit) {
  for (const [sizeKey, sizeValue] of Object.entries(sizeModels)) {
    const matchedSizeModelState = sizeValue.states.find(
      state =>
      weight >= state.minWeight
          && weight <= state.maxWeight
            && fit === state.fit
    )
    if (matchedSizeModelState) {
      state.currentMinHeight = matchedSizeModelState.minHeight
      state.currentMaxHeight = matchedSizeModelState.maxHeight
      break
    }
  }
}

function calcWeightBounds(height, fit) {
  for (const [sizeKey, sizeValue] of Object.entries(sizeModels)) {
    const matchedSizeModelState = sizeValue.states.find(
      state =>
        height >= state.minHeight
          && height <= state.maxHeight
            && fit === state.fit
    )
    if (matchedSizeModelState) {
      state.currentMinWeight = matchedSizeModelState.minWeight
      state.currentMaxWeight = matchedSizeModelState.maxWeight
      break
    }
  }
}

function calcFitOptions(height, weight) {
  const allMatchedSizeModelFits = new Set()
  for (const [sizeKey, sizeValue] of Object.entries(sizeModels)) {
    const matchedSizeModelState = sizeValue.states.find(
      state =>
        height >= state.minHeight
          && height <= state.maxHeight
          && weight >= state.minWeight
          && weight <= state.maxWeight
    )
    if (matchedSizeModelState) {
      allMatchedSizeModelFits.add(matchedSizeModelState.fit)
    }
  }
  allOptions = selectForm.querySelectorAll('option')
  allOptions.forEach(option => option.classList.add('faded'))
  allMatchedSizeModelFits.forEach(fit => {
    allOptions[fit].classList.remove('faded')
  })
}

function tryToChangeBoundsByHeightAndFit(actualHeight, actualFit) {
  for (const [sizeKey, sizeValue] of Object.entries(sizeModels)) {
    const matchedSizeModelState = sizeValue.states.find(
      state =>
        actualHeight >= state.minHeight
          && actualHeight <= state.maxHeight
            && actualFit === state.fit
    )
    console.log('new bounds', matchedSizeModelState)
    if (matchedSizeModelState) {
      state.currentMinHeight = matchedSizeModelState.minHeight
      state.currentMaxHeight = matchedSizeModelState.maxHeight
      state.currentMinWeight = matchedSizeModelState.minWeight
      state.currentMaxWeight = matchedSizeModelState.maxWeight
      return matchedSizeModelState
    }
  }
}

function tryToChangeBoundsByWeightAndFit(actualWeight, actualFit) {
  for (const [sizeKey, sizeValue] of Object.entries(sizeModels)) {
    const matchedSizeModelState = sizeValue.states.find(
      state =>
        actualWeight >= state.minWeight
          && actualWeight <= state.maxWeight
            && actualFit === state.fit
    )
    if (matchedSizeModelState) {
      state.currentMinHeight = matchedSizeModelState.minHeight
      state.currentMaxHeight = matchedSizeModelState.maxHeight
      state.currentMinWeight = matchedSizeModelState.minWeight
      state.currentMaxWeight = matchedSizeModelState.maxWeight
      return matchedSizeModelState
    }
  }
}

// event listeners calculator

// heightField.addEventListener("change", distributeSizes);
heightField.addEventListener("input", onHeightFieldChaned);
heightField.addEventListener("keydown", preventNonNumericImput);

// weightField.addEventListener("change", distributeSizes);
weightField.addEventListener("input", onWeightFieldChaned)
weightField.addEventListener("keydown", preventNonNumericImput);

selectForm.addEventListener("change", onFitOptionSelected);
// selectForm.addEventListener("change", renderTypeMessage);

function isNumberOrBackspace(key) {
  return /[0-9]/.test(key) || key === "Backspace"
}

// prevent default
function preventNonNumericImput(event) {
  if(!isNumberOrBackspace(event.key)) {
    event.preventDefault()
  }
}

function checkHeightFieldValueInSteadyStateRange (height) {
  if(height < state.currentMinHeight) {
    heightField.dataset.message = 'Please select a value that is no less than 145!'
    setTimeout(() => {
      height = Number(heightField.value)
      if(height < state.currentMinHeight) {
        heightField.value = state.currentMinHeight
      } else if (height > state.currentMaxHeight) {
        heightField.value = state.currentMaxHeight
      }
      state.heightChecking = false
      heightField.dataset.message = ''
      if (state.checkingStage === CHECKING_STAGES.FIRST) {
        calcWeightBounds(heightField.value, state.fit)
        checkWeightFieldValue()
      } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
        distributeSizes()
      }
    }, 3000)
  } else if (height > state.currentMaxHeight) {
    heightField.value = state.currentMaxHeight
    state.heightChecking = false
    if (state.checkingStage === CHECKING_STAGES.FIRST) {
      calcWeightBounds(heightField.value, state.fit)
      checkWeightFieldValue()
    } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
      distributeSizes()
    }
  } else {
    state.heightChecking = false
    if (state.checkingStage === CHECKING_STAGES.FIRST) {
      calcWeightBounds(heightField.value, state.fit)
      checkWeightFieldValue()
    } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
      distributeSizes()
    }
  }
}

function checkWeightFieldValueInSteadyStateRange (weight) {
  if(weight < state.currentMinWeight) {
    setTimeout(()=>{
      weight = Number(weightField.value)
      if(weight < state.currentMinWeight) {
        weightField.value = state.currentMinWeight
      } else if (weight > state.currentMaxWeight) {
        weightField.value = state.currentMaxWeight
      }
      state.weightChecking = false
      if (state.checkingStage === CHECKING_STAGES.FIRST) {
        calcHeightBounds(weightField.value, state.fit)
        checkHeightFieldValue()
      } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
        distributeSizes()
      }
    }, 3000)
  } else if (weight > state.currentMaxWeight) {
    weightField.value = state.currentMaxWeight
    state.weightChecking = false
    if (state.checkingStage === CHECKING_STAGES.FIRST) {
      calcHeightBounds(weightField.value, state.fit)
      checkHeightFieldValue()
    } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
      distributeSizes()
    }
  } else {
    state.weightChecking = false
    if (state.checkingStage === CHECKING_STAGES.FIRST) {
      calcHeightBounds(weightField.value, state.fit)
      checkHeightFieldValue()
    } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
      distributeSizes()
    }
  }
}

function checkHeightFieldValue() {
  console.log('state', state)
  if (!state.heightChecking) {
    state.heightChecking = true
    if (state.checkingStage === CHECKING_STAGES.ZERO) {
      state.checkingStage = CHECKING_STAGES.FIRST
    } else if (state.checkingStage === CHECKING_STAGES.FIRST) {
      state.checkingStage = CHECKING_STAGES.SECOND
    }
    heightField.dataset.message = ''
    let height = Number(heightField.value)
    // let weight = Number(weightField.value)
    if (!state.rangesChangedAutomatically) {
      pleaseWaitHeader.innerText = TRY_CHANGE_BOUNDES_PLEASE_WAIT_TEXT
      state.rangesChangedAutomatically = true
      if (height < state.currentMinHeight || height > state.currentMaxHeight) {
        setTimeout(() => {
          height = Number(heightField.value)
          const result = tryToChangeBoundsByHeightAndFit(height, state.fit)
          if (result) {
            state.heightChecking = false
            if (state.checkingStage === CHECKING_STAGES.FIRST) {
              calcWeightBounds(heightField.value, state.fit)
              checkWeightFieldValue()
            } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
              distributeSizes()
            }
          } else {
            checkHeightFieldValueInSteadyStateRange(height)
          }
        }, 3000)
      } else {
        state.heightChecking = false
        if (state.checkingStage === CHECKING_STAGES.FIRST) {
          calcWeightBounds(heightField.value, state.fit)
          checkWeightFieldValue()
        } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
          distributeSizes()
        }
      }
    } else {
      checkHeightFieldValueInSteadyStateRange(height)
    }
  }
}

function checkWeightFieldValue() {
  if (!state.weightChecking) {
    state.weightChecking = true
    if (state.checkingStage === CHECKING_STAGES.ZERO) {
      state.checkingStage = CHECKING_STAGES.FIRST
    } else if (state.checkingStage === CHECKING_STAGES.FIRST) {
      state.checkingStage = CHECKING_STAGES.SECOND
    }
    // let height = Number(heightField.value)
    let weight = Number(weightField.value)
    if (!state.rangesChangedAutomatically) {
      pleaseWaitHeader.innerText = TRY_CHANGE_BOUNDES_PLEASE_WAIT_TEXT
      state.rangesChangedAutomatically = true
      if(weight < state.currentMinWeight || weight > state.currentMaxWeight) {
        setTimeout(() => {
          weight = Number(weightField.value)
          const result = tryToChangeBoundsByWeightAndFit(weight, state.fit)
          if (result) {
            state.weightChecking = false
            if (state.checkingStage === CHECKING_STAGES.FIRST) {
              calcHeightBounds(weightField.value, state.fit)
              checkHeightFieldValue()
            } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
              distributeSizes()
            }
          } else {
            checkWeightFieldValueInSteadyStateRange(weight)
          }
        }, 3000)
      } else {
        state.weightChecking = false
        if (state.checkingStage === CHECKING_STAGES.FIRST) {
          calcHeightBounds(weightField.value, state.fit)
          checkHeightFieldValue()
        } else if (state.checkingStage === CHECKING_STAGES.SECOND) {
          distributeSizes()
        }
      }
    } else {
      checkWeightFieldValueInSteadyStateRange(weight)
    }
  }
}

function matchSize(height, weight, fit) {
  return Object.entries(sizeModels).find(([sizeKey, sizeValue]) => sizeValue.states.find(
    state =>
        height >= state.minHeight
          && height <= state.maxHeight
          && weight >= state.minWeight
          && weight <= state.maxWeight
          && fit === state.fit
  ))
}

// TODO
function findFirstSizeModelStateByFit(fit) {
  for (const [sizeKey, sizeValue] of Object.entries(sizeModels)) {
    
    const matchedSizeModelState = sizeValue.states.find(
      s => {console.log('fits', fit, s.fit); return fit === s.fit}
    )
    if (matchedSizeModelState) {
      return matchedSizeModelState
    }
  }
  return null
}

function onHeightFieldChaned() {
  checkHeightFieldValue()
}

function onWeightFieldChaned() {
  checkWeightFieldValue()
}

function onFitOptionSelected() {
  state.checkingStage = CHECKING_STAGES.SECOND
  distributeSizes()
}

// functions

function findSizeModelsStatesByFit(fit) {
  const allMatchedSizeModelStates = new Set()
  for (const [sizeKey, sizeValue] of Object.entries(sizeModels)) {
    sizeValue.states.filter(
      state => fit === state.fit
    ).forEach(state => allMatchedSizeModelStates.add(state))
  }
  return allMatchedSizeModelStates
}

function renderSizeToDom(sizeText) {
  sizeRenderField.innerHTML = sizeMessage + "" + sizeText
}

function renderTypeMessage() {
  typeMessageField.innerHTML = typeMessage[state.fit]
}

function distributeSizes() {

  if (state.checkingStage === CHECKING_STAGES.SECOND) {

    state.checkingStage = CHECKING_STAGES.ZERO

    height = Number(heightField.value);
    weight = Number(weightField.value);
    state.fit = Number(selectForm.value);

    rangesAvailable.innerText = ''
    findSizeModelsStatesByFit(state.fit).forEach(state => {
      rangesAvailable.innerText +=
        `altezza ${state.minHeight}-${state.maxHeight}, peso ${state.minWeight}-${state.maxWeight}; `
    })

    calcFitOptions(height, weight)

    calculatedSize = matchSize(height, weight, state.fit)

    if (calculatedSize) {
      console.log('calculatedSize', calculatedSize)
      const [sizeKey, sizeValue] = calculatedSize
      // console.log('sizeValue.message', sizeValue.text)
      renderSizeToDom(sizeValue.text)
    } else {
      const sizeModelState = findFirstSizeModelStateByFit(state.fit)
      console.log('sizeModelState', sizeModelState)
      if (sizeModelState) {
        state.currentMinHeight = sizeModelState.minHeight
        state.currentMaxHeight = sizeModelState.maxHeight
        state.currentMinWeight = sizeModelState.minWeight
        state.currentMaxWeight = sizeModelState.maxWeight
        checkHeightFieldValue()
      } else {
        state.currentMinHeight = MIN_HEIGHT
        state.currentMaxHeight = MAX_HEIGHT
        state.currentMinWeight = MIN_WEIGHT
        state.currentMaxWeight = MAX_WEIGHT
        sizeRenderField.innerHTML = " Questa misura non e disponibile"
      }
    }
    pleaseWaitHeader.innerText = ''
    state.rangesChangedAutomatically = false
  }
}
