const LANDING_PAGE = document.querySelector('#landing-page')
const GAME_PAGE = document.querySelector('#game-page')
const START_BTN = document.querySelector('#start-btn')
const WINNER_ELEM = document.querySelector('#winner')

const SHOW_SET_BUTTON = document.querySelector('#showSetButton')
const IS_THERE_SET_BUTTON = document.querySelector('#isThereSetButton')
const PLUS_3_BUTTON = document.querySelector('#plus3Button')

const HAS_SET_POPUP = document.querySelector('#has-set-popup')

const GAME_STATE = {
  started: false,
  level: 'ADVANCED',
  mode: 'TRAINING',
  players: [{ num: 1, name: 'Játékos 1', score: 0, canSelect: true }],
  activePlayerIndex: -1,
  extras: {
    tellSet: false,
    showSet: false,
    plus3: 'AUTO',
  },
  deck: [],
  cardsOnTable: 12,
  selectedCards: [],
  started_at: Date.now(),
}

const onePlayer = state => state.players.length === 1

function updateUIWithState(state) {
  for (const key in state) GAME_STATE[key] = state[key]

  document.querySelector('#more-options').style.display =
    state.mode === 'CONTEST' ? 'none' : 'grid'

  LANDING_PAGE.style.display = state.started ? 'none' : 'flex'
  GAME_PAGE.style.display = state.started ? 'block' : 'none'

  document.querySelectorAll('#deck .card').forEach(card => card.remove())

  if (
    GAME_STATE.started &&
    GAME_STATE.extras.plus3 === 'AUTO' &&
    !isThereSet(state)
  ) {
    GAME_STATE.cardsOnTable += 3
  }

  const cardsOnTable = state.deck.slice(
    0,
    state.deck.length >= state.cardsOnTable
      ? state.cardsOnTable
      : state.deck.length
  )

  for (const card of cardsOnTable) renderCard(card)

  if (state.started && (state.deck.length === 0 || !isThereSet(state))) {
    document.querySelectorAll('.card').forEach(card => card.remove())

    console.log('Game over')
    const winners = state.players.filter(
      ({ score }) => score === Math.max(...state.players.map(p => p.score))
    )

    if (winners.length > 1) {
      WINNER_ELEM.innerHTML = `A játék döntetlen lett ${winners
        .map(p => p.name)
        .join(winners.length === 2 ? ' és ' : ', ')} között.`
    } else {
      WINNER_ELEM.innerHTML = `${winners[0].name} a nyertes ${winners[0].score} ponttal!`
    }

    if (state.players.length === 1) {
      const time = new Date(Date.now() - state.started_at)

      WINNER_ELEM.innerHTML = `${
        state.players[0].name
      } ${time.getMinutes()}:${time.getSeconds()} alatt nyert.`

      const localState = JSON.parse(
        localStorage.getItem('SET_GAME_STATS') || '{"onePlayerBestTime": 0}'
      )

      const { onePlayerBestTime } = localState

      console.log(onePlayerBestTime)

      if (Date.now() - state.started_at > onePlayerBestTime) {
        localStorage.setItem(
          'SET_GAME_STATS',
          JSON.stringify({
            ...localState,
            onePlayerBestTime: time.getTime(),
          })
        )
      }
    }

    GAME_STATE.players = []
    renderPlayingPlayers()
  }

  renderPlayingPlayers()
}

START_BTN.addEventListener('click', _ => {
  const deck = shuffleDeck(...createDeck(GAME_STATE.level === 'ADVANCED'))

  console.log(deck)

  if (!GAME_STATE.extras.showSet) SHOW_SET_BUTTON.style.display = 'none'
  if (!GAME_STATE.extras.tellSet) IS_THERE_SET_BUTTON.style.display = 'none'
  if (GAME_STATE.extras.plus3 === 'AUTO') PLUS_3_BUTTON.style.display = 'none'

  updateUIWithState({
    ...GAME_STATE,
    started: true,
    deck,
    started_at: Date.now(),
  })
})

PLUS_3_BUTTON.addEventListener('click', _ => plus3Card())

IS_THERE_SET_BUTTON.addEventListener('click', _ => {
  const cardsOnTable = GAME_STATE.deck.slice(
    0,
    GAME_STATE.deck.length >= GAME_STATE.cardsOnTable
      ? GAME_STATE.cardsOnTable
      : GAME_STATE.deck.length
  )

  let hasSet = false
  for (const card of cardsOnTable) {
    for (const card2 of cardsOnTable) {
      for (const card3 of cardsOnTable) {
        if (
          isSetValid([card, card2, card3]) &&
          new Set([card, card2, card3]).size > 1
        ) {
          hasSet = true
          break
        }
      }
      if (hasSet) break
    }
  }

  HAS_SET_POPUP.innerHTML = `A leosztásban ${hasSet ? 'van' : 'nincs'} set.`
  HAS_SET_POPUP.classList.add('active')

  setTimeout(() => {
    HAS_SET_POPUP.classList.remove('active')
  }, 5000)
})

SHOW_SET_BUTTON.addEventListener('click', _ => {
  const cardsOnTable = GAME_STATE.deck.slice(
    0,
    GAME_STATE.deck.length >= GAME_STATE.cardsOnTable
      ? GAME_STATE.cardsOnTable
      : GAME_STATE.deck.length
  )

  for (const card of cardsOnTable) {
    for (const card2 of cardsOnTable) {
      for (const card3 of cardsOnTable) {
        const setSet = new Set([card, card2, card3])
        if (isSetValid([card, card2, card3]) && setSet.size > 1) {
          setSet.forEach(scard => {
            document
              .querySelector(`#${createCardId(scard)}`)
              .classList.add('hint')
          })
          return
        }
      }
    }
  }
})

function plus3Card() {
  updateUIWithState({
    ...GAME_STATE,
    cardsOnTable: GAME_STATE.cardsOnTable + 3,
  })
}
