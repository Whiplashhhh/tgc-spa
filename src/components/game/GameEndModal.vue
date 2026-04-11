<template>
  <div>
    <!--  <NModal
    v-model:show="gameStore.game?.result!"
    :mask-closable="false"
    :closable="false"
    preset="dialog"
  >
    <template #header>
      <div class="modal-header">
        {{ isWinner() ? 'Victoire!' : 'Défaite' }}
      </div>
    </template>

    <div class="modal-content">
      <div v-if="isWinner()" class="result-info winner">
        <p class="result-text">Vous avez remporté la victoire!</p>
        <p class="opponent-info">
          Adversaire: {{ gameStore.game?.result?.loserUsername }}
        </p>
      </div>

      <div v-else class="result-info loser">
        <p class="result-text">Vous avez perdu cette partie.</p>
        <p class="opponent-info">
          Vainqueur: {{ gameStore.game?.result?.winnerUsername }}
        </p>
      </div>
    </div>

    <template #action>
      <NButton type="primary" @click="returnToLobby"> Retour au lobby </NButton>
    </template>
  </NModal>-->
  </div>
</template>

<script setup lang="ts">
/*
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()
const authStore = useAuthStore()
const router = useRouter()
*/

/*const isWinner = () => {
  return gameStore.game?.result?.winnerId === authStore.user?.id
}

const returnToLobby = () => {
  gameStore.resetGame()
  router.push('/')
}*/
</script>

<style scoped>
.modal-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.modal-content {
  text-align: center;
  padding: 20px 0;
}

.result-info {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.result-info.winner {
  background-color: #e8f5e9;
  border: 2px solid #4caf50;
}

.result-info.loser {
  background-color: #ffebee;
  border: 2px solid #f44336;
}

.result-text {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.opponent-info {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>
