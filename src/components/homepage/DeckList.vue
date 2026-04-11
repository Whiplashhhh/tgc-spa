<template>
  <NCard>
    <div v-if="decksToDisplay.length > 0">
      <div v-for="deck in decksToDisplay" :key="deck.id">
        <div class="deck-header">
          <NH2>{{ deck.name }}</NH2>
          <div class="buttons">
            <NButton @click="router.push(`/deck-detail/${deck.id}`)"
              >Voir le détail</NButton
            >
            <NButton
              type="info"
              @click="router.push(`/deck-creation/${deck.id}`)"
              >Modifier</NButton
            >
            <NButton type="error" @click="deleteDeck(deck.id)"
              >Supprimer</NButton
            >
          </div>
        </div>
        <CardGrid
          :liste-pokemons="getDeckCards(deck)"
          size="md"
          :model-value="new Set()"
        />
        <NDivider />
      </div>
    </div>
    <div v-else>
      <NEmpty
        description="Aucun deck disponible pour l'instant, veuillez en créer un"
      />
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import CardGrid from '@/components/common/CardGrid.vue'
import { useApi } from '@/composables/useApi.ts'
import router from '@/router.ts'
import { useAuthStore } from '@/store/auth.store.ts'
import type { Card, Deck, DeckCard } from '@/types'

const message = useMessage()
const authStore = useAuthStore()
storeToRefs(authStore)

const api = useApi()
const decksToDisplay = ref<Deck[]>([])
const allCards = ref<Card[]>([])

onMounted(async () => {
  try {
    decksToDisplay.value = await api.getMyDecks()
    allCards.value = await api.getCards()
  } catch (e) {
    message.error(`erreur lors de la récupération des decks : ${e}`)
  }
})

const getDeckCards = (deck: Deck): (Card | undefined)[] => {
  return deck.cards.map((deckCard: DeckCard) =>
    allCards.value.find((card) => card.id === deckCard.cardId),
  )
}

const deleteDeck = async (deckId: number) => {
  try {
    await api.deleteDeck(deckId)
    decksToDisplay.value = decksToDisplay.value.filter(
      (deck) => deck.id !== deckId,
    )
  } catch (e) {
    message.error(`errer lors de la suppression du deck : ${e}`)
  }
}
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 10px;
}
.deck-header {
  display: flex;
  justify-content: space-between;
}
</style>
