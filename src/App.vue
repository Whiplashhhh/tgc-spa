<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar v-if="isAuth" />
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useAuthStore } from '@/store/auth.store.ts'

import HeaderBar from './components/layout/HeaderBar.vue'

const authStore = useAuthStore()

const isAuth = computed(() => authStore.isAuthenticated)
</script>

<style>
body {
  padding: 0 20px;
}
</style>
