const addPlayerBtn = document.querySelector('#add-player')
const playerList = document.querySelector('#player-list')
const connectedPlayers = document.querySelector('#connected-players')

addPlayerBtn?.addEventListener('click', addPlayer)

function addPlayer(_) {
  const num = GAME_STATE.players.length + 1
  const player = {
    num,
    name: `Játékos ${num}`,
    score: 0,
    canSelect: true,
  }

  GAME_STATE.players.push(player)

  playerList?.appendChild(createPlayerElement(player))
}

const createPlayerElement = player => {
  const playerListItem = document.createElement('li')
  playerListItem.classList.add('player')

  const playerNameInput = document.createElement('input')

  playerNameInput.value = player.name
  playerNameInput.type = 'text'
  playerNameInput.classList.add('player-name')
  playerNameInput.setAttribute('data-player-id', `${player.num}`)

  playerListItem.innerHTML = `
        <div class="player-number">${player.num}</div>
    `
  playerListItem.appendChild(playerNameInput)

  playerNameInput.addEventListener('keyup', ({ target }) => {
    GAME_STATE.players[player.num - 1].name = target.value
  })

  return playerListItem
}

function renderPlayerList() {
  playerList.innerHTML = ''

  GAME_STATE.players.forEach(player => {
    playerList?.appendChild(createPlayerElement(player))
  })
}

function renderPlayingPlayers() {
  document
    .querySelectorAll('#connected-players h4')
    .forEach(item => item.remove())

  for (const player of GAME_STATE.players) {
    const element = document.createElement('h4')
    element.id = `player-${player.num}`
    if (!player.canSelect) element.classList.add('disabled')

    element.innerHTML = `${player.name} (<span class="player-score">${player.score}</span>)`

    element.addEventListener('click', _ => {
      reset()
      startTimer(element)

      document
        .querySelectorAll('#connected-players h4')
        .forEach(elem => elem.classList.remove('active'))
      element.classList.add('active')
      GAME_STATE.activePlayerIndex = player.num - 1
    })

    connectedPlayers.appendChild(element)
  }
}

renderPlayerList()
