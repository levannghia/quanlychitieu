<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary">
      <q-toolbar class="text-white">
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>
          <q-btn-dropdown class="q-pa-none" flat icon="settings">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle v-model="mobileData" label="Use Mobile Data" />
                <q-toggle v-model="bluetooth" label="Bluetooth" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ reEmail }}</div>

                <q-btn @click="handleLogout()" color="primary" label="Logout" push size="sm" v-close-popup />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="bg-white">
      <tabs-footer></tabs-footer>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import TabsFooter from 'components/TabsFooter.vue'
import useAuthUser from "src/composables/useAuthUser";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

const { user, logout } = useAuthUser();
const router = useRouter();
const route = useRoute();
const reEmail = user.value.email.split("@")[0];
const $q = useQuasar();

const mobileData = ref(false);
const bluetooth = ref(false);

const handleLogout = async () => {
  $q.dialog({
    title: "Đăng xuất?",
    message: "Bạn muốn đăng xuất tài khoản khỏi thiết bị này",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await logout();
    router.replace({ name: "login" });
  });
};

</script>
