<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
      </NSpace>
      <NSpace align="center" :size="16">
        <NText depth="3">{{ user?.username }}</NText>
        <NButton size="small" @click="logout">Déconnexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import router from '@/router.ts'
import { ROUTES } from '@/routes.ts'
import { useAuthStore } from '@/store/auth.store.ts'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string

const logout = () => {
  authStore.logout()
  router.replace(ROUTES.LOGIN)
}
</script>
