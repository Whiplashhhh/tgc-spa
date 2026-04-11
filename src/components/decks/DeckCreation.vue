<template>
  <div class="container">
    <div class="header">
      <NButton @click="router.back">Retour</NButton>
      <div class="header-label">
        <b>{{ isEditMode ? 'Modifier le deck' : 'Créer un deck' }}</b>
      </div>
    </div>
    <NDivider />
    <div class="deck-name-div">
      <div style="padding-bottom: 10px">Nom du deck</div>
      <NInput
        v-model:value="deckName"
        class="deck-name"
        type="text"
        placeholder="Choisir le nom du deck"
      />
    </div>
    <NDivider />
    <div class="cards-selection">
      <div>{{ selectedCount.size }}/10 cartes sélectionnées</div>
      <NButton
        type="primary"
        :disabled="selectedCount.size !== 10 || !deckName"
        @click="isEditMode ? updateDeck() : createDeck()"
      >
        {{ isEditMode ? 'Modifier le deck' : 'Créer le deck' }}
      </NButton>
      <CardGrid
        v-model="selectedCount"
        :liste-pokemons="allCard"
        :max-selections="10"
        :is-selectable="true"
        size="sm"
      />
      <NButton
        v-if="allCard.length > 0"
        type="primary"
        :disabled="selectedCount.size !== 10 || !deckName"
        @click="isEditMode ? updateDeck() : createDeck()"
      >
        {{ isEditMode ? 'Modifier le deck' : 'Créer le deck' }}
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import CardGrid from '@/components/common/CardGrid.vue'
import { useApi } from '@/composables/useApi.ts'
import router from '@/router.ts'
import type { Card, DeckPayload } from '@/types'

const api = useApi()
const message = useMessage()
const route = useRoute()
const allCard = ref<Card[]>([])
const selectedCount = ref<Set<number>>(new Set())
const deckName = ref('')

const isEditMode = computed(() => !!route.params.id)
const deckId = computed(() =>
  route.params.id ? Number(route.params.id) : null,
)

onBeforeMount(async () => {
  try {
    allCard.value = await api.getCards()
  } catch (e) {
    message.error(`erreur lors du chargement des cartes : ${e}`)
  }
})

watch(
  () => deckId.value,
  async (newDeckId) => {
    if (newDeckId) {
      try {
        const deck = await api.getDeck(newDeckId)
        deckName.value = deck.name
        const cardIds = deck.cards.map((deckCard) => deckCard.cardId)
        selectedCount.value = new Set(cardIds)
      } catch (e) {
        message.error(`erreur lors du chargement du deck : ${e}`)
      }
    }
  },
  { immediate: true },
)

const createDeck = async () => {
  const deckToCreate: DeckPayload = {
    name: deckName.value,
    cards: Array.from(selectedCount.value),
  }
  try {
    await api.createDeck(deckToCreate)
    router.back()
  } catch (e) {
    message.error(`erreur lors de la création de deck : ${e}`)
  }
}

const updateDeck = async () => {
  if (!deckId.value) return

  const deckToUpdate: DeckPayload = {
    name: deckName.value,
    cards: Array.from(selectedCount.value),
  }
  try {
    await api.updateDeck(deckId.value, deckToUpdate)
    await router.push(`/deck-detail/${deckId.value}`)
  } catch (e) {
    message.error(`erreur lors de la modification du deck : ${e}`)
  }
}
</script>

<style scoped>
.container {
  margin: 30px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
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
