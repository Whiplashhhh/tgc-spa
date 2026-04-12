<template>
  <NCard class="card">
    <NForm>
      <NH2>Parties disponibles</NH2>
      <div v-if="availableRooms.length === 0">
        <NEmpty description="Aucune partie disponible pour l'instant" />
      </div>
      <div v-else class="rooms">
        <NCard
          v-for="(room, index) in availableRooms"
          :key="room.id"
          class="room-card"
        >
          <NH3>Partie #{{ index + 1 }}</NH3>
          <NFormItem :label="'Hôte: ' + room.host.username" class="deck-select">
            <NSelect
              placeholder="Sélectionner un deck"
              :options="
                decks.map((deck) => ({
                  label: deck.name,
                  value: deck.id,
                }))
              "
              :loading="loading"
              clearable
            />
          </NFormItem>

          <NButton type="primary" block @click="joinGame(room)">
            Rejoindre
          </NButton>
        </NCard>
      </div>
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi.ts'
import { useGameStore } from '@/store/game.store.ts'
import type { Deck, Room } from '@/types'

const message = useMessage()
const router = useRouter()
const api = useApi()
const gameStore = useGameStore()

const decks = ref<Deck[]>([])
const selectedDecks = ref<Record<string, number | null>>({})
const loading = ref(false)

const availableRooms = computed(() => gameStore.availableRooms)

onMounted(async () => {
  try {
    loading.value = true
    decks.value = await api.getMyDecks()
  } catch (e) {
    message.error(`erreur lors de la récupération des decks : ${e} `)
  } finally {
    loading.value = false
  }
})

const joinGame = (room: Room) => {
  const selectedDeckId = selectedDecks.value[room.id]
  if (!selectedDeckId) {
    message.warning('Veuillez sélectionner un deck')
    return
  }
  gameStore.joinRoom({ deckId: selectedDeckId, roomId: room.id })
  selectedDecks.value[room.id] = null

  router.push('/game')
}
</script>

<style scoped>
.card {
  overflow: hidden;
}

.rooms {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 220px;
  overflow: auto;
}
</style>
