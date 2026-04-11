<template>
  <div class="container">
    <div class="header">
      <div class="header-back">
        <NButton @click="router.back">Retour</NButton>
      </div>
      <div class="header-label">
        <b>{{ deckName }}</b>
      </div>
      <div>
        <NButton type="info" @click="router.push(`/deck-creation/${deckId}`)"
          >Modifier</NButton
        >
      </div>
    </div>
    <NDivider />
    <div class="cards-selection">
      <CardGrid :liste-pokemons="deckCards" :max-selections="10" size="sm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import CardGrid from '@/components/common/CardGrid.vue'
import { useApi } from '@/composables/useApi.ts'
import router from '@/router.ts'
import type { Card } from '@/types'

const api = useApi()
const message = useMessage()
const route = useRoute()
const allCard = ref<Card[]>([])
const selectedCount = ref<Set<number>>(new Set())
const deckName = ref('')
const deckCards = ref<Card[]>([])

const deckId = computed(() =>
  route.params.id ? Number(route.params.id) : null,
)

onMounted(async () => {
  try {
    allCard.value = await api.getCards()

    if (deckId.value) {
      const deck = await api.getDeck(deckId.value)
      deckName.value = deck.name

      const cardIds = deck.cards.map((deckCard) => deckCard.cardId)
      selectedCount.value = new Set(cardIds)

      deckCards.value = allCard.value.filter((card) =>
        cardIds.includes(card.id),
      )
    }
  } catch (e) {
    message.error(`erreur lors du chargement des cartes : ${e}`)
  }
})
</script>

<style scoped>
.container {
  margin: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-label {
  font-size: 3em;
}

.cards-selection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
