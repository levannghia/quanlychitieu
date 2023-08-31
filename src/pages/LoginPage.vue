<template>
  <q-page class="q-pa-md text-center">
    <img alt="Wallet logo" src="/icons/payment.png" style="width: 150px; height: 150px">
    <div class="q-pa-md q-mx-auto" style="max-width: 400px">

      <q-form @submit.prevent="handleLogin()" class="q-gutter-md">
        <q-input filled v-model="form.email" label="Email *" hint="example@gmail.com" lazy-rules
          :rules="[val => val && val.length > 0 || 'Vui lòng nhập email']" />

        <q-input filled type="password" v-model="form.password" label="Mật khẩu *" lazy-rules :rules="[
          val => val !== null && val !== '' || 'Vui lòng nhập mật khẩu',
          val => val.length >= 6 || 'Nhập ít nhất 6 ký tự'
        ]" />

        <div>
          <q-btn label="Đăng nhập" type="submit" color="primary" class="full-width" />
        </div>
      </q-form>
    </div>
    <div class="q-pt-md">
      <q-btn @click="loginSocial('google')" color="white" text-color="black" icon="img:/icons/icons8-google-48.png"
        label="Login With Google" rounded />
    </div>
    <div class="q-px-md q-mt-md text-center">
      <div class="q-mb-md no-account">Don't have an account?<q-btn dense no-caps color="primary" flat to="/auth/register" size="15px">Register here</q-btn></div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useSupabase from 'src/boot/supabase'
import useAuthUser from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'

const router = useRouter()
const { supabase } = useSupabase()
const { login } = useAuthUser()
const form = ref({
  email: '',
  password: ''
})

onMounted(() => {
})

const loginSocial = async (prov) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: prov,
    redirectTo: window.location.origin
  })
}

const handleLogin = async () => {
    await login(form.value)
    router.push('/')
}

</script>
