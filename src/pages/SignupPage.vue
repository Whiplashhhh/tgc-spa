<template>
  <NCard class="sign-up-page">
    <NForm ref="formRef" class="sign-up-form" :model="formValue" :rules="rules">
      <NH1>Créez un compte</NH1>
      <NFormItem label="Username" path="username">
        <NInput
          v-model:value="formValue.username"
          class="sign-up-input"
          type="text"
          placeholder="..."
        />
      </NFormItem>
      <NFormItem label="Email" path="email">
        <NInput
          v-model:value="formValue.email"
          class="sign-up-input"
          type="text"
          placeholder="example@mail.com"
        />
      </NFormItem>
      <NFormItem label="Mot de passe" path="password">
        <NInput
          v-model:value="formValue.password"
          class="sign-up-input"
          type="password"
          placeholder="..."
        />
      </NFormItem>
      <NAlert v-if="authStore.error">
        {{ authStore.error }}
      </NAlert>
      <NButton
        class="confirm"
        :disabled="authStore.loading"
        type="primary"
        @click="handleValidateClick"
      >
        Confirmer
      </NButton>

      <!--      <pre>{{ JSON.stringify(formValue, null, 2) }}</pre>-->

      <NP
        >Vous possédez déjà un compte,
        <NA @click="redirectToLogin"><u>Connectez-vous</u></NA></NP
      >
    </NForm>
  </NCard>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

import router from '@/router.ts'
import { ROUTES } from '@/routes.ts'
import { useAuthStore } from '@/store/auth.store.ts'
import type { SignUpPayload } from '@/types'

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const authStore = useAuthStore()

const formValue = ref<SignUpPayload>({
  email: '',
  password: '',
  username: '',
})

const rules: FormRules = {
  email: {
    required: true,
    message: 'Le mail est requis',
    trigger: 'blur',
  },
  password: {
    required: true,
    message: 'Le mot de passe est requis',
    trigger: ['input', 'blur'],
  },
  username: {
    required: true,
    message: "Le nom d'utilisateur est requis",
    trigger: 'blur',
  },
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        await authStore.signUp(formValue.value)
        message.success('Compte créé')
        await router.replace(ROUTES.HOME)
      } catch (error) {
        message.error((error as Error).message || 'Erreur lors d la création')
      }
    } else {
      message.error('Formulaire invalide')
    }
  })
}

const redirectToLogin = () => {
  router.push(ROUTES.LOGIN)
}
</script>

<style scoped>
.sign-up-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border: none;
  padding-top: 25vh;
}

.sign-up-form {
  width: 100%;
  max-width: 360px;
}

.confirm {
  width: 100%;
}

.sign-up-input {
  width: 100%;
}
</style>
