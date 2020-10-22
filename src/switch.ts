const SWITCH_ELEMENTS = document.querySelectorAll<HTMLDivElement>('.switch')

SWITCH_ELEMENTS.forEach(item => {
  item.addEventListener('click', e => handleSwitch(e, item))
})

function handleSwitch(e: MouseEvent, switchElem: HTMLDivElement) {
  switchElem
    .querySelectorAll('.switch-option')
    .forEach(option => option.classList.remove('active'))

  const target = e.target as HTMLDivElement

  target.classList.add('active')

  const setting = target.getAttribute('data-setting') as keyof GameState
  const value = target.getAttribute('data-value')

  if (setting && value) {
    GAME_STATE[setting] = value
  }
}
