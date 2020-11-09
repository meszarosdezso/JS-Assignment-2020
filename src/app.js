const LANDING_PAGE = document.querySelector('#landing-page')
const GAME_PAGE = document.querySelector('#game-page')
const START_BTN = document.querySelector('#start-btn')
const WINNER_ELEM = document.querySelector('#winner')

const GAME_STATE = {
  started: false,
  level: 'ADVANCED',
  mode: 'TRAINING',
  players: [{ num: 1, name: 'Játékos 1', score: 0, canSelect: true }],
  activePlayerIndex: -1,
  extras: {
    tellSet: false,
    showSet: false,
    plus3: 'AUTOMATIC',
  },
  deck: [],
  selectedCards: [],
}

function updateUIWithState(state) {
  for (const key in state) GAME_STATE[key] = state[key]

  document.querySelector('#more-options').style.display =
    state.mode === 'CONTEST' ? 'none' : 'grid'

  LANDING_PAGE.style.display = state.started ? 'none' : 'flex'
  GAME_PAGE.style.display = state.started ? 'block' : 'none'

  document.querySelectorAll('#deck .card').forEach(card => card.remove())

  if (state.deck.length === 0 && state.started) {
    console.log('Game over')
    const winner = state.players.find(
      ({ score }) => score === Math.max(...state.players.map(p => p.score))
    )

    WINNER_ELEM.innerHTML = `${winner.name} a nyertes ${winner.score} ponttal`
    GAME_STATE.players = []
    renderPlayingPlayers()
  }

  for (let i = 0; i < 12; i++) {
    if (state.deck[i]) {
      renderCard(state.deck[i])
    }
  }

  renderPlayingPlayers()
}

START_BTN.addEventListener('click', _ => {
  const deck = shuffleDeck(...createDeck())

  console.log(deck)

  updateUIWithState({ ...GAME_STATE, started: true, deck })
})
