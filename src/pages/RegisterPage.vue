<template>
  <q-page class="q-pa-md text-center">
    <img alt="Wallet logo" src="/icons/payment.png" style="width: 150px; height: 150px">
    <div class="q-pa-md q-mx-auto" style="max-width: 400px">

      <q-form @submit.prevent="handleRegister()" class="q-gutter-xs">
        <q-input filled v-model="form.name" label="Họ và tên *" lazy-rules
          :rules="[val => val && val.length > 0 || 'Vui lòng họ tên']" />

        <q-input filled v-model="form.email" label="Email *" hint="example@gmail.com" lazy-rules type="email"
          :rules="[val => val && val.length > 0 || 'Vui lòng nhập email']" />

        <q-input filled type="password" v-model="form.password" label="Mật khẩu *" lazy-rules :rules="[
          val => val !== null && val !== '' || 'Vui lòng nhập mật khẩu',
          val => val.length >= 6 || 'Nhập ít nhất 6 ký tự'
        ]" />

        <q-input filled type="password" v-model="form.confirmPassword" label="Nhập lại password *" lazy-rules :rules="[
          val => val !== null && val !== '' || 'Vui lòng nhập mật khẩu xác nhận',
          val => val == form.password || 'Mật khẩu xác nhận không chính xác'
        ]" />
        <div>
          <q-btn label="Đăng ký" type="submit" color="primary" class="full-width" />
        </div>
      </q-form>
    </div>
    <div class="q-px-md q-mt-xs text-center">
      <div class="q-mb-md no-account">Don't have an account? <q-btn dense no-caps color="primary" flat to="/auth/login" size="15px">Login here</q-btn></div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useSupabase from '../boot/supabase'
import useAuthUser from 'src/composables/useAuthUser'

const { supabase } = useSupabase()
const router = useRouter()
const { register } = useAuthUser()

const form = ref({
  email: '',
  password: '',
  name: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  await register(form.value)
  router.push({
    name: 'email-confirmation',
    query: {email: form.value.email}
  })
}

onMounted(() => {
})

</script>
