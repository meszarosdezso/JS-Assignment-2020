interface Card {
  shape: 'OVAL' | 'WAVY' | 'ROMBUS'
  color: 'RED' | 'GREEN' | 'PURPLE'
  number: 1 | 2 | 3
  content: 'FULL' | 'STRIPED' | 'EMPTY'
}

type CardSet = [Card, Card, Card]

function isSetValid(set: CardSet): boolean {
  for (const key in set[0]) {
    if (new Set(set.map(s => s[key as 'shape'])).size === 1) return true
  }
  return false
}

function renderCard(card: Card) {
  return `<div class="card">
      <pre class="code">
        ${JSON.stringify(card, null, 2)}
      </pre>
    </div>`
}

const TEST_SET: CardSet = [
  { color: 'GREEN', content: 'EMPTY', number: 1, shape: 'WAVY' },
  { color: 'PURPLE', content: 'FULL', number: 2, shape: 'WAVY' },
  { color: 'GREEN', content: 'STRIPED', number: 3, shape: 'WAVY' },
]

console.log(isSetValid(TEST_SET))
