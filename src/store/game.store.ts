import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store.ts'
import type {
  AttackPayload,
  CreateRoomPayload,
  DrawCardsPayload,
  GameResult,
  GameSession,
  GameState,
  PlayCardPayload,
  Room,
} from '@/types/game.ts'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

export const useGameStore = defineStore('game', {
  state: (): GameState & { socket: Socket | null } => ({
    roomId: null,
    deckId: null,
    rooms: [],
    game: null,
    playerRole: null,
    loading: false,
    error: null,
    socket: null,
  }),

  getters: {
    isInRoom: (state) => !!state.roomId,
    availableRooms: (state) =>
      state.rooms.filter((room) => room.status === 'waiting'),

    /**
     * pour savoir si c'est notre tour
     */
    isCurrentPlayerTurn: (state) => {
      if (!state.game) return false
      const authStore = useAuthStore()
      return state.game.currentPlayerTurn === authStore.user?.id
    },

    /**
     * retourne le plateau du joueur courant
     */
    currentPlayerBoard: (state) => {
      if (!state.game) return null
      const authStore = useAuthStore()
      return (
        state.game.players.find((p) => p.playerId === authStore.user?.id) ||
        null
      )
    },

    /**
     * retourne le plateau de l'adversaire
     */
    opponentBoard: (state) => {
      if (!state.game) return null
      const authStore = useAuthStore()
      return (
        state.game.players.find((p) => p.playerId !== authStore.user?.id) ||
        null
      )
    },

    /**
     * donne rôle et plateaux
     */
    gameInfos: (state) => ({
      playerRole: state.playerRole,
      currentPlayerBoard: state.game?.players.find(() => state.roomId) || null,
      opponentBoard: state.game?.players.find(() => state.roomId) || null,
    }),
  },

  actions: {
    /**
     * Initialiser la connexion socket.io avec JWT
     */
    initializeSocket() {
      if (this.socket) return
      const authStore = useAuthStore()
      this.socket = io(SOCKET_URL, {
        auth: {
          token: authStore.token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      })

      //events
      //lobby
      this.socket.on('roomsList', this.handleRoomsList)
      this.socket.on('roomsListUpdate', this.handleRoomsListUpdated)
      this.socket.on('roomCreated', this.handleRoomCreated)

      //jeu
      this.socket.on('gameStarted', this.handleGameStarted)
      this.socket.on('gameStateUpdated', this.handleGameStateUpdated)
      this.socket.on('gameEnded', this.handleGameEnded)
      this.socket.on('opponentDisconnected', this.handleOpponentDisconnected)

      //erreurs
      this.socket.on('error', this.handleError)
      this.socket.on('disconnect', this.handleDisconnect)
    },

    /**
     * Déconnecte socket.io
     */
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    },

    /**
     * Charge la liste des rooms dispos
     */
    loadRoomsList() {
      if (!this.socket) return
      this.loading = true
      this.socket.emit('getRoomsList')
    },

    /**
     * Crée une room
     */
    createRoom(payload: CreateRoomPayload) {
      if (!this.socket) return
      this.loading = true
      this.deckId = payload.deckId
      this.socket.emit('createRoom', payload)
    },

    /**
     * Rejoindre une room
     */
    joinRoom(payload: CreateRoomPayload) {
      if (!this.socket) return
      this.loading = true
      this.deckId = payload.deckId
      this.socket.emit('joinRoom', payload)
    },

    /**
     * piocher une carte
     */
    drawCards(payload: DrawCardsPayload) {
      if (!this.socket) return
      this.socket.emit('drawCards', payload)
    },

    /**
     * jouer une carte
     */
    playCard(payload: PlayCardPayload) {
      if (!this.socket) return
      this.socket.emit('playCard', payload)
    },

    /**
     * attaquer
     */
    attack(payload: AttackPayload) {
      if (!this.socket) return
      this.socket.emit('attack', payload)
    },

    /**
     * terminer son tour
     */
    endTurn() {
      if (!this.socket) return
      this.socket.emit('endTurn')
    },

    //events
    handleRoomsList(rooms: Room[]) {
      this.rooms = rooms
      this.loading = false
    },

    handleRoomsListUpdated(rooms: Room[]) {
      this.rooms = rooms
    },

    handleRoomCreated(data: { roomId: string; playerRole: 'host' }) {
      this.roomId = data.roomId
      this.playerRole = data.playerRole
      this.loading = false
    },

    handleGameStarted(data: {
      game: GameSession
      playerRole: 'host' | 'guest'
    }) {
      this.game = data.game
      this.playerRole = data.playerRole
      this.loading = false
      const router = useRouter()
      router.push('/game')
    },

    handleGameStateUpdated(game: GameSession) {
      this.game = game
    },

    handleGameEnded(result: GameResult) {
      if (this.game) {
        this.game.result = result
      }
    },

    handleOpponentDisconnected(message: string) {
      this.error = message
    },

    handleError(errorMessage: string) {
      this.error = errorMessage
      this.loading = false
    },

    handleDisconnect() {
      this.socket = null
    },

    /**
     * réinitialiser le jeu
     */
    resetGame() {
      this.roomId = null
      this.deckId = null
      this.rooms = []
      this.game = null
      this.playerRole = null
      this.error = null
      this.loading = false
    },
  },
})
