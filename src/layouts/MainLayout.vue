<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="route.name == 'home' ? 'bg-primary' : 'bg-white'">
      <q-toolbar :class="route.name == 'home' ? 'text-white' : 'text-primary'">
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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" />
    </q-page-sticky>
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

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

const leftDrawerOpen = ref(false);
const essentialLinks = ref([]);

essentialLinks.value = linksList;

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
