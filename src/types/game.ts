import type { Card } from './card'

export interface Room {
  id: string
  host: {
    id: number
    username: string
  }
  deckId: number
  maxPlayers: number
  currentPlayers: number
  status: 'waiting' | 'playing'
  createdAt: string
}

export interface PlayerBoard {
  playerId: number
  username: string
  hp: number
  maxHp: number
  hand: Card[]
  bench: Card[]
  active: Card | null
  discard: Card[]
}

export interface GameSession {
  id: string
  roomId: string
  currentPlayerTurn: number
  players: PlayerBoard[]
  result: GameResult | null
}

export interface GameResult {
  winnerId: number
  winnerUsername: string
  loserId: number
  loserUsername: string
  endedAt: string
}

export interface GameState {
  roomId: string | null
  deckId: number | null
  rooms: Room[]
  game: GameSession | null
  playerRole: 'host' | 'guest' | null
  loading: boolean
  error: string | null
}

export interface CreateRoomPayload {
  deckId: number
}

export interface JoinRoomPayload {
  roomId: string
  deckId: number
}

export interface DrawCardsPayload {
  quantity: number
}

export interface PlayCardPayload {
  cardId: number
  target: 'active' | 'bench'
}

export interface AttackPayload {
  targetPlayerId: number
}
