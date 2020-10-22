interface GameState {
  level: 'BEGINNER' | 'ADVANCED'
  mode: 'TRAINING' | 'CONTEST'
  others?: any
  players: Player[]
}

const GAME_STATE: GameState = {
  level: 'ADVANCED',
  mode: 'TRAINING',
  players: [{ num: 1, name: 'Játékos 1' }],
}
