// interface Card {
//   shape: 'OVAL' | 'WAVY' | 'ROMBUS'
//   color: 'RED' | 'GREEN' | 'PURPLE'
//   number: 1 | 2 | 3
//   content: 'FULL' | 'STRIPED' | 'EMPTY'
// }

// type CardSet = [Card, Card, Card]

// const TEST_SET = [
//   { color: 'GREEN', content: 'EMPTY', number: 1, shape: 'OVAL' },
//   { color: 'PURPLE', content: 'FULL', number: 2, shape: 'WAVY' },
//   { color: 'GREEN', content: 'STRIPED', number: 3, shape: 'WAVY' },
// ]

const SET_ERROR_POPUP = document.querySelector('#wrong-set-popup')

const SVGs = {
  OVAL: (color, content) =>
    `<circle cx="40" cy="40" r="32" fill="${
      content === 'STRIPED'
        ? `url(#stripe-${color})`
        : content === 'FULL'
        ? `var(--accent-${color.toLowerCase()})`
        : 'none'
    }" stroke-width="8" stroke="var(--accent-${color.toLowerCase()})" />`,
  WAVY: (color, content) =>
    `<path fill="${
      content === 'STRIPED'
        ? `url(#stripe-${color})`
        : content === 'FULL'
        ? `var(--accent-${color.toLowerCase()})`
        : 'none'
    }" stroke-width="6" stroke="var(--accent-${color.toLowerCase()})" d="M8.8,35.9c-.94,0-1.77-.71-2.47-2.11C2.92,27,3.25,19.06,7.25,11.52A13.16,13.16,0,0,1,19.4,4.61a20.77,20.77,0,0,1,2.45.15A50,50,0,0,1,37.1,8.82a34.26,34.26,0,0,0,14.57,3.51c6.45,0,12.75-2.26,18.71-6.73C72.3,4.16,73.43,4,73.83,4c1.06,0,2,2.12,2.26,5.16.51,5.71-1.87,12.22-6.23,17a22.29,22.29,0,0,1-16.62,7.38,30.48,30.48,0,0,1-12.73-3,27,27,0,0,0-11.35-2.64c-8.54,0-14.49,4.5-17.35,6.66-.35.27-.79.6-1,.7A4.09,4.09,0,0,1,8.8,35.9Z"/>`,
  ROMBUS: (color, content) =>
    `<rect width="60" height="60" fill="${
      content === 'STRIPED'
        ? `url(#stripe-${color})`
        : content === 'FULL'
        ? `var(--accent-${color.toLowerCase()})`
        : 'none'
    }" stroke-width="12" stroke="var(--accent-${color.toLowerCase()})" />`,
}

const createStripePattern = color => `
  <pattern
    id="stripe-${color}"
    patternUnits="userSpaceOnUse"
    width="4"
    height="4"
  >
    <path
      d="M-1,1 l2,-2
        M0,4 l4,-4
        M3,5 l2,-2"
      style="stroke: var(--accent-${color.toLowerCase()}); stroke-width: 2"
    />
  </pattern>
`

function isSetValid(set) {
  return Object.keys(set[0]).reduce((valid, prop) => {
    const setSet = new Set(set.map(c => c[prop]))
    return valid && (setSet.size === 1 || setSet.size === 3)
  }, true)
}

const createCardId = card => Object.values(card).join('')

function renderCard(card) {
  const cardElement = document.createElement('div')
  cardElement.classList.add('card')
  cardElement.id = createCardId(card)

  cardElement.innerHTML = `<svg class="${card.shape}">
    ${createStripePattern(card.color)}
    ${SVGs[card.shape](card.color, card.content)}
  </svg>`.repeat(card.number)

  cardElement.addEventListener('click', _ => {
    if (GAME_STATE.activePlayerIndex !== -1) {
      if (cardElement.classList.contains('selected')) {
        cardElement.classList.remove('selected')

        GAME_STATE.selectedCards = GAME_STATE.selectedCards.filter(scard => {
          for (const key in scard) {
            if (scard[key] !== card[key]) return true
          }
          return false
        })
      } else if (GAME_STATE.selectedCards.length < 3) {
        cardElement.classList.add('selected')
        GAME_STATE.selectedCards.push(card)
      } else return

      if (GAME_STATE.selectedCards.length === 3) {
        if (isSetValid(GAME_STATE.selectedCards)) {
          GAME_STATE.players[GAME_STATE.activePlayerIndex].score += 1

          const newDeck = GAME_STATE.deck.filter(
            dcard =>
              !GAME_STATE.selectedCards.some(
                scard => JSON.stringify(scard) === JSON.stringify(dcard)
              )
          )

          updateUIWithState({
            ...GAME_STATE,
            started: true,
            deck: newDeck,
          })

          GAME_STATE.players.forEach(p => (p.canSelect = true))
        } else {
          GAME_STATE.players[GAME_STATE.activePlayerIndex].score -= 1
          GAME_STATE.players[GAME_STATE.activePlayerIndex].canSelect = false
          SET_ERROR_POPUP.classList.add('active')
          setTimeout(() => {
            SET_ERROR_POPUP.classList.remove('active')
          }, 4000)
        }

        if (GAME_STATE.players.every(p => !p.canSelect)) {
          GAME_STATE.players.forEach(p => (p.canSelect = true))
        }

        GAME_STATE.activePlayerIndex = -1
        renderPlayingPlayers()
        reset()
      }
    } else {
      console.log('No player is selected')
    }
  })

  document.querySelector('#deck').appendChild(cardElement)
}

const resetSelectedCards = () => {
  GAME_STATE.selectedCards = []
  document
    .querySelectorAll('.card.selected')
    .forEach(item => item.classList.remove('selected'))
}

function createDeck(withContent) {
  const shapes = ['OVAL', 'WAVY', 'ROMBUS']
  const colors = ['RED', 'GREEN', 'PURPLE']
  const numbers = [1, 2, 3]
  const contents = ['FULL', 'STRIPED', 'EMPTY']

  const deck = []

  colors.forEach(color =>
    shapes.forEach(shape =>
      numbers.forEach(number =>
        withContent
          ? contents.forEach(content =>
              deck.push({ color, shape, number, content })
            )
          : deck.push({ color, shape, number, content: 'EMPTY' })
      )
    )
  )

  return deck
}

const shuffleDeck = (...deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function isThereSet(state) {
  const cardsOnTable = state.deck.slice(
    0,
    state.deck.length >= state.cardsOnTable
      ? state.cardsOnTable
      : state.deck.length
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
  return hasSet
}
