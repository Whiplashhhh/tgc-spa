<template>
  <div class="cards">
    <div v-for="pokemon in props.listePokemons" :key="pokemon?.id">
      <PokemonCard
        v-if="pokemon"
        :card="pokemon"
        :size="props.size"
        :is-selected="selectedCards.has(pokemon.id)"
        :is-limit-reached="selectedCards.size >= props.maxSelections"
        :is-selectable="props.isSelectable"
        @toggle-selection="toggleCardSelection(pokemon.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import PokemonCard from '@/components/common/PokemonCard.vue'
import type { Card } from '@/types/card.ts'

const props = withDefaults(
  defineProps<{
    modelValue?: Set<number>
    listePokemons: (Card | undefined)[]
    size?: string
    maxSelections?: number
    isSelectable?: boolean
  }>(),
  {
    size: 'md',
    maxSelections: 10,
    isSelectable: false,
  },
)

const selectedCards = ref(new Set<number>(props.modelValue))

const emit = defineEmits<{
  'update:modelValue': [selectedCards: Set<number>]
}>()

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedCards.value = new Set<number>(newValue)
    }
  },
)

const toggleCardSelection = (cardId: number) => {
  if (selectedCards.value.has(cardId)) {
    selectedCards.value.delete(cardId)
  } else {
    selectedCards.value.add(cardId)
  }
  emit('update:modelValue', new Set<number>(selectedCards.value))
}
</script>

<style scoped>
.cards {
  justify-content: center;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
