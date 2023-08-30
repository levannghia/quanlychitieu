<template>
  <q-page class="flex flex-center column">

    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    <div class="q-pt-lg">
        <q-btn @click="login('google')" color="white" text-color="black" icon="img:icons/icons8-google-48.png" label="Login With Google" rounded/>
    </div>
  </q-page>
</template>

<script setup>
import {onMounted ,ref } from 'vue'
import useSupabase from '../boot/supabase'

const { supabase } = useSupabase()
const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})

console.log(session.value);

const login = async (prov) => {
    const {data, error} = await supabase.auth.signInWithOAuth({
         provider: prov,
         redirectTo: window.location.origin
    })
} 

</script>