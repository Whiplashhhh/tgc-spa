<template>
  <NCard class="login-page">
    <NForm class="login-form">
      <NH1>Connectez-vous</NH1>
      <NFormItem label="Email">
        <NInput
          v-model:value="email"
          class="sign-up-input"
          type="text"
          placeholder="example@mail.com"
        />
      </NFormItem>
      <NFormItem label="Mot de passe">
        <NInput
          v-model:value="password"
          class="login-input"
          type="password"
          placeholder="..."
        />
      </NFormItem>
      <NAlert v-if="authStore.error">
        {{ authStore.error }}
      </NAlert>
      <NFormItem>
        <NButton
          class="confirm"
          :disabled="authStore.loading"
          type="primary"
          @click="handleSubmit"
        >
          Se connecter
        </NButton>
      </NFormItem>
      <NP
        >Vous ne possédez pas de compte,
        <NA @click="redirectToSignUp"><u>Créez-en un</u></NA></NP
      >
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { ROUTES } from '@/routes.ts'
import { useAuthStore } from '@/store/auth.store.ts'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  await authStore.signIn({ email: email.value, password: password.value })
  await router.push(ROUTES.HOME)
}

const redirectToSignUp = () => {
  router.push(ROUTES.SIGNUP)
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border: none;
  padding-top: 25vh;
}

.login-form {
  width: 100%;
  max-width: 360px;
}

.login-input {
  width: 100%;
}

.confirm {
  width: 100%;
}
</style>
