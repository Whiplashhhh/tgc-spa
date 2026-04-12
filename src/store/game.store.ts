import { defineStore } from 'pinia'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store.ts'
import type { PokemonType } from '@/types'
import type {
  AttackPayload,
  CreateRoomPayload,
  DrawCardsPayload,
  GameResult,
  GameSession,
  GameState,
  JoinRoomPayload,
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

      // debug
      this.socket.on('connect', () => {
        /*
        console.log('Socket connecté! ID:', this.socket?.id)
*/
      })

      this.socket.on('disconnect', () => {
        /*
        console.log('Socket déconnecté')
*/
        this.socket = null
      })

      /*this.socket.on('connect_error', (error) => {
        console.error('Erreur de connexion:', error)
      })*/

      // events
      // lobby
      this.socket.on('roomsList', (rooms) => {
        /*
        console.log('Rooms reçues:', rooms)
*/
        this.handleRoomsList(rooms)
      })

      this.socket.on('roomsListUpdate', (rooms) => {
        /*
        console.log('Rooms mises à jour:', rooms)
*/
        this.handleRoomsListUpdated(rooms)
      })

      this.socket.on('roomCreated', (data) => {
        /*
        console.log('Room créée:', data)
*/
        this.handleRoomCreated(data)
      })

      // Jeu
      this.socket.on('gameStarted', (data) => {
        /*
        console.log('Partie démarrée:', data)
*/
        this.handleGameStarted(data)
      })

      this.socket.on('gameStateUpdated', (game) => {
        /*
        console.log('État du jeu mis à jour:', game)
*/
        this.handleGameStateUpdated(game)
      })

      this.socket.on('gameEnded', (result) => {
        /*
        console.log('Partie terminée:', result)
*/
        this.handleGameEnded(result)
      })

      this.socket.on('opponentDisconnected', (message) => {
        /*
        console.error('Adversaire déconnecté:', message)
*/
        this.handleOpponentDisconnected(message)
      })

      // erreurs
      this.socket.on('error', (errorMessage) => {
        /*console.error('Erreur socket:', errorMessage)*/
        this.handleError(errorMessage)
      })
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
    joinRoom(payload: JoinRoomPayload) {
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

    /**
     * mock d'une partie
     */
    mockGame() {
      const mockCards = [
        {
          id: 1,
          name: 'Pikachu',
          hp: 60,
          attack: 40,
          type: 'Electric' as PokemonType,
          pokedexNumber: 25,
          imgUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        },
        {
          id: 2,
          name: 'Raichu',
          hp: 80,
          attack: 60,
          type: 'Electric' as PokemonType,
          pokedexNumber: 26,
          imgUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png',
        },
        {
          id: 3,
          name: 'Charizard',
          hp: 120,
          attack: 100,
          type: 'Fire' as PokemonType,
          pokedexNumber: 6,
          imgUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
        },
        {
          id: 4,
          name: 'Venusaur',
          hp: 100,
          attack: 80,
          type: 'Grass' as PokemonType,
          pokedexNumber: 3,
          imgUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
        },
        {
          id: 5,
          name: 'Blastoise',
          hp: 100,
          attack: 85,
          type: 'Water' as PokemonType,
          pokedexNumber: 9,
          imgUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
        },
        {
          id: 6,
          name: 'Mewtwo',
          hp: 150,
          attack: 120,
          type: 'Psychic' as PokemonType,
          pokedexNumber: 150,
          imgUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
        },
      ]

      const mockAuthStore = useAuthStore()
      const currentUserId = mockAuthStore.user?.id || 1
      const currentUsername = mockAuthStore.user?.username || 'Vous'
      const opponentId = 2
      const opponentUsername = 'Adversaire'

      this.game = {
        id: 'mock-game-1',
        roomId: 'mock-room-1',
        currentPlayerTurn: currentUserId,
        players: [
          {
            playerId: currentUserId,
            username: currentUsername,
            hp: 100,
            maxHp: 100,
            hand: [mockCards[0], mockCards[1], mockCards[2]],
            bench: [mockCards[3], mockCards[4]],
            active: mockCards[5],
            discard: [],
          },
          {
            playerId: opponentId,
            username: opponentUsername,
            hp: 80,
            maxHp: 100,
            hand: [mockCards[1], mockCards[2]],
            bench: [mockCards[0]],
            active: mockCards[3],
            discard: [mockCards[4]],
          },
        ],
        result: null,
      }
      this.roomId = 'mock-room-1'
      this.playerRole = 'host'
      this.loading = false
    },
  },
})
