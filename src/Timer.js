const timerElem = document.querySelector('#select-timer')

let timer

const startTimer = element => {
  timerElem.style.opacity = 1

  clearInterval(timer)

  timer = setInterval(() => {
    const val = +timerElem.innerHTML
    if (val > 1) {
      timerElem.innerHTML = +timerElem.innerHTML - 1
    } else {
      element.classList.remove('active')
      GAME_STATE.activePlayerIndex = -1
      reset()
    }
  }, 1000)
}

function reset() {
  clearInterval(timer)
  resetSelectedCards()
  timerElem.style.opacity = 0.3
  timerElem.innerHTML = 10
}

const stopTimer = () => {}