<template>
  <NCard>
    <NForm>
      <NH2>Créer une partie</NH2>
      <NFormItem>
        <NSelect
          v-model:value="selectedDeckId"
          placeholder="Sélectionner un deck"
          :options="decks.map((deck) => ({ label: deck.name, value: deck.id }))"
          :loading="loading"
          clearable
        />
      </NFormItem>
      <NButton type="primary" :disabled="!selectedDeckId" @click="createGame">
        Créer la partie
      </NButton>
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/store/game.store'
import type { Deck } from '@/types'

const message = useMessage()
const api = useApi()
const gameStore = useGameStore()

const decks = ref<Deck[]>([])
const selectedDeckId = ref<number | null>(null)
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    decks.value = await api.getMyDecks()
  } catch (e) {
    message.error(`Erreur lors de la récupération des decks : ${e}`)
  } finally {
    loading.value = false
  }
})

const createGame = () => {
  if (!selectedDeckId.value) {
    message.warning('Veuillez sélectionner un deck')
    return
  }
  gameStore.deckId = selectedDeckId.value
  // Puis appeler l'action du store pour créer la room
  gameStore.createRoom({ deckId: selectedDeckId.value })
}
</script>

<style scoped></style>
