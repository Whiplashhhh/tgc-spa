<template>
  <div class="container">
    <NH1>Jouer</NH1>
    <div class="top">
      <CreateGame />
      <AvailableGames />
    </div>
    <div class="deck">
      <NH1>Mes decks</NH1>
      <NButton type="primary" style="margin-top: 15px" @click="deckCreation">
        + Nouveau deck
      </NButton>
    </div>
    <DeckList />
  </div>
</template>

<script setup lang="ts">
import AvailableGames from '@/components/homepage/AvailableGames.vue'
import CreateGame from '@/components/homepage/CreateGame.vue'
import DeckList from '@/components/homepage/DeckList.vue'
import router from '@/router.ts'
import { ROUTES } from '@/routes.ts'

const deckCreation = () => {
  router.push(ROUTES.DECKCREATION)
}
</script>

<style scoped>
.container {
  margin: 20px;
}

.top {
  display: flex;
  gap: 20px;
  max-height: 40vh;
}
.deck {
  display: flex;
  justify-content: space-between;
}
</style>
