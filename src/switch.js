const SWITCH_ELEMENTS = document.querySelectorAll('.switch')
const MORE_OPTIONS = document.querySelectorAll('.extra-option')

SWITCH_ELEMENTS.forEach(item => {
  item.addEventListener('click', e => handleSwitch(e, item))
})

MORE_OPTIONS.forEach(item => {
  item.addEventListener('change', e => handleExtraOptionSet(e, item))
})

function handleSwitch({ target }, switchElem) {
  if (!target.classList.contains('switch-option')) return

  switchElem
    .querySelectorAll('.switch-option')
    .forEach(option => option.classList.remove('active'))

  target.classList.add('active')

  const setting = target.getAttribute('data-setting')
  const value = target.getAttribute('data-value')

  if (setting && value) {
    GAME_STATE[setting] = value

    updateUIWithState(GAME_STATE)
  }
}

function handleExtraOptionSet({ target }, elem) {
  const value = target.checked === undefined ? target.value : target.checked
  const setting = target.name

  if (setting && value !== undefined) {
    GAME_STATE.extras[setting] = value
    updateUIWithState(GAME_STATE)
  }
}
