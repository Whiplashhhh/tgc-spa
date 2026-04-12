<template>
  <div class="game-page">
    <!-- Zone adversaire -->
    <div class="zone-wrapper opponent-zone">
      <PlayerZone
        label="Adversaire"
        :board="gameStore.opponentBoard"
        :is-current-player="false"
      />
    </div>

    <!-- Barre d'actions -->
    <div class="actions-bar">
      <div class="player-s-round">
        <NTag
          :type="gameStore.isCurrentPlayerTurn ? 'success' : 'warning'"
          class="round"
        >
          {{ gameStore.isCurrentPlayerTurn ? 'Votre tour' : 'Tour adversaire' }}
        </NTag>
      </div>
      <div class="game-info">
        <i>{{ lastAction }}</i>
      </div>
      <div class="game-buttons">
        <NSpace size="small">
          <NButton
            :disabled="!canDraw"
            @click="gameStore.drawCards({ quantity: 1 })"
          >
            Piocher
          </NButton>
          <NButton
            type="error"
            :disabled="!canAttack"
            @click="
              gameStore.attack({
                targetPlayerId: gameStore.opponentBoard?.playerId || 0,
              })
            "
          >
            Attaquer
          </NButton>
          <NButton
            type="warning"
            :disabled="!gameStore.isCurrentPlayerTurn"
            @click="gameStore.endTurn()"
          >
            Terminer le tour
          </NButton>
        </NSpace>
      </div>
    </div>

    <!-- Zone joueur -->
    <div class="zone-wrapper player-zone">
      <PlayerZone
        label="Vous"
        :board="gameStore.currentPlayerBoard"
        :is-current-player="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

import PlayerZone from '@/components/game/PlayerZone.vue'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()

const lastAction = computed(() => {
  return gameStore.error || "En attente d'une action..."
})

const canDraw = computed(() => {
  return (
    gameStore.isCurrentPlayerTurn &&
    (gameStore.currentPlayerBoard?.hand.length || 0) < 5
  )
})

const canAttack = computed(() => {
  return (
    gameStore.isCurrentPlayerTurn &&
    !!gameStore.currentPlayerBoard?.active &&
    !!gameStore.opponentBoard?.active
  )
})

onMounted(() => {
  if (!gameStore.socket) {
    gameStore.initializeSocket()
  }

  // mock pour tester
  if (!gameStore.game) {
    gameStore.mockGame()
  }
})

onUnmounted(() => {
  // Ne pas déconnecter pour rester dans la partie
})
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 85vh;
  gap: 16px;
  padding: 16px;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border: 1px solid lightgrey;
  border-radius: 8px;
}

.round {
  background-color: #b9fba2;
  color: #1a7a00;
  opacity: 50%;
  height: 34px;
}

.player-zone {
  display: flex;
  flex-direction: column;
}
</style>
