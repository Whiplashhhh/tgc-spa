<template>
  <div :class="props.size">
    <NCard
      class="card-container"
      :class="[
        isSelected ? 'is-selected' : null,
        isDisabled ? 'is-disabled' : null,
        !props.isSelectable ? 'is-not-selectable' : null,
      ]"
      @click="handleClick()"
    >
      <div class="card">
        <NImage
          :width="props.size === 'md' ? 100 : 70"
          :src="card.imgUrl"
          :alt="card.name"
          preview-disabled
        />
        <NText class="id">#{{ card.pokedexNumber }}</NText>
        <NText class="name">{{ card.name }}</NText>
        <NTag :style="{ 'background-color': typeColor }">{{ card.type }}</NTag>
        <NProgress
          v-if="props.currentHp !== null"
          indicator-placement="none"
          :percentage="currentHpPercent"
          :color="colorHp"
        />
        <div class="infos">
          <NText>❤️{{ card.hp }}</NText>
          <NText>⚔️{{ card.attack }}</NText>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors.ts'
import type { Card } from '@/types/card.ts'

const { getTypeColor, hpColor } = useColors()

const props = withDefaults(
  defineProps<{
    card: Card
    size?: string
    currentHp?: number | null
    isSelected?: boolean
    isLimitReached?: boolean
    isSelectable?: boolean
  }>(),
  {
    size: 'md',
    currentHp: null,
    isSelected: false,
    isLimitReached: false,
    isSelectable: false,
  },
)

const emit = defineEmits<{
  toggleSelection: []
}>()

const typeColor = getTypeColor(props.card.type)

const currentHpPercent = computed(() => {
  if (props.currentHp !== null) {
    return (100 * props.currentHp) / props.card.hp
  }
  return 0
})

const colorHp = computed(() => {
  if (props.currentHp !== null) {
    return hpColor(currentHpPercent.value)
  }
  return null
})

const isDisabled = computed(() => {
  return props.isLimitReached && !props.isSelected
})

const handleClick = () => {
  if (!isDisabled.value && props.isSelectable) {
    emit('toggleSelection')
  }
}
</script>

<style scoped>
.card-container {
  border: solid 1px lightgrey;
  height: fit-content;
  cursor: pointer;
  border-radius: 8px;
}

.is-selected {
  border: solid 1px #6ab350 !important;
  background-color: #f0ffe8;
}

.is-disabled {
  cursor: not-allowed;
  opacity: 0.3;
  border: solid 1px #979797;
}

.is-not-selectable {
  cursor: default;
}

.md {
  width: calc(100vw / 5 - 40px);
}

.sm {
  max-width: 150px;
  width: calc(100vw / 5 - 80px);
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.id {
  color: #8a8a8a;
}

.name {
  font-weight: bold;
}

.infos {
  display: inherit;
  column-gap: 10px;
}
</style>
