const addPlayerBtn = document.querySelector<HTMLButtonElement>('#add-player')
const playerList = document.querySelector<HTMLUListElement>('#players')

interface Player {
  num: number
  name: string
}

addPlayerBtn?.addEventListener('click', addPlayer)

function addPlayer(_: MouseEvent) {
  const num = GAME_STATE.players.length + 1
  const player: Player = {
    name: `Játékos ${num}`,
    num,
  }

  GAME_STATE.players.push(player)

  playerList?.appendChild(createPlayerElement(player))
}

const createPlayerElement = (player: Player) => {
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
    GAME_STATE.players[player.num - 1].name = (target as HTMLInputElement).value
  })

  return playerListItem
}

function renderPlayers() {
  playerList!.innerHTML = ''

  GAME_STATE.players.forEach(player => {
    playerList?.appendChild(createPlayerElement(player))
  })
}

renderPlayers()
