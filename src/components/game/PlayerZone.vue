<template>
  <div class="player-zone">
    <div class="zone-header">
      <NH3>{{ label }}</NH3>
      <div class="score">{{ board?.playerId ? 0 : 0 }}/3 KO</div>
    </div>

    <div class="active-pokemon">
      <div v-if="board?.active" class="pokemon-card">
        <PokemonCard
          :card="board.active"
          size="md"
          :current-hp="board.active.hp"
          :is-selectable="false"
        />
      </div>
      <div v-else class="placeholder">
        <p>Aucune carte active</p>
      </div>
    </div>

    <div v-if="isCurrentPlayer" class="player-hand">
      <p class="hand-label">Main ({{ board?.hand.length || 0 }}/5)</p>
      <PlayerHand :board="board" />
      <p class="deck-label">Deck : {{ 10 }} cartes restantes</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/common/PokemonCard.vue'
import PlayerHand from '@/components/game/PlayerHand.vue'
import type { PlayerBoard } from '@/types/game'

defineProps<{
  label: string
  board: PlayerBoard | null
  isCurrentPlayer?: boolean
}>()
</script>

<style scoped>
.player-zone {
  border: 1px solid lightgrey;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  margin: 15px;
}

.active-pokemon {
  text-align: center;
  padding-bottom: 25px;
}
</style>
