<template>
  <div class="player-hand">
    <!-- Label Main -->
    <div class="hand-header">
      <p class="hand-label">Main ({{ board?.hand.length || 0 }}/5)</p>
    </div>

    <!-- Cartes de la main (réutilise CardGrid) -->
    <div v-if="board?.hand && board.hand.length > 0" class="hand-cards">
      <CardGrid
        :liste-pokemons="board.hand"
        size="sm"
        :is-selectable="false"
        @click-card="playCard"
      />
      <div
        v-for="card in board.hand"
        :key="card.id"
        :class="['card-wrapper', { clickable: canPlayCard() }]"
        @click="playCard(card.id)"
      >
        <PokemonCard :card="card" size="sm" :is-selectable="false" />
      </div>
    </div>
    <div v-else class="no-cards">
      <NEmpty description="Main vide" />
    </div>

    <!-- Label Deck -->
    <div class="deck-info">
      <p class="deck-label">Deck ({{ deckRemaining() }} cartes restantes)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardGrid from '@/components/common/CardGrid.vue'
import { useGameStore } from '@/store/game.store'
import type { PlayerBoard } from '@/types'

defineProps<{
  board: PlayerBoard | null
}>()

const gameStore = useGameStore()

const canPlayCard = () => {
  return gameStore.isCurrentPlayerTurn && !gameStore.currentPlayerBoard?.active
}

const playCard = (cardId: number) => {
  if (!canPlayCard()) return
  gameStore.playCard({
    cardId,
    target: 'active',
  })
}

const deckRemaining = () => {
  const totalCards = 10 // Deck standard = 10 cartes
  const inHand = gameStore.currentPlayerBoard?.hand.length || 0
  const inActive = gameStore.currentPlayerBoard?.active ? 1 : 0
  const inBench = gameStore.currentPlayerBoard?.bench.length || 0
  const inDiscard = gameStore.currentPlayerBoard?.discard.length || 0
  return Math.max(0, totalCards - inHand - inActive - inBench - inDiscard)
}
</script>

<style scoped>
.player-hand {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
}

.hand-header {
  padding: 0 8px;
}

.hand-label {
  margin: 0;
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.hand-cards {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
}

.card-wrapper {
  display: flex;
  align-items: center;
  cursor: not-allowed;
  opacity: 0.6;
}

.card-wrapper.clickable {
  cursor: pointer;
  opacity: 1;
}

.card-wrapper.clickable:hover {
  transform: translateY(-4px);
}

.no-cards {
  text-align: center;
  padding: 16px;
}

.deck-info {
  padding: 8px;
  text-align: center;
}

.deck-label {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
