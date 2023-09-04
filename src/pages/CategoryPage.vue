<template>
  <q-page class="q-pa-md">
    <div style="max-width: 600px">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="mails" label="Khoảng thu" no-caps />
        <q-tab name="alarms" label="Khoản chi" no-caps />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <q-list>
            <div v-for="(category, index) in listCategory" :key="index">
              <q-item v-ripple v-if="category.type === true">
                <q-item-section avatar>
                  <q-avatar color="positive" text-color="white" icon="monetization_on" />
                </q-item-section>

                <q-item-section>{{ category.name }}</q-item-section>
                <q-item-section top side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" flat dense round icon="edit" />
                    <q-btn size="12px" flat dense round icon="delete" />
                  </div>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <q-list>
            <div v-for="(category, index) in listCategory" :key="index">
            <q-item v-ripple v-if="category.type === false">
              <q-item-section avatar>
                <q-avatar color="negative" text-color="white" icon="credit_card_off" />
              </q-item-section>

              <q-item-section>{{ category.name }}</q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" flat dense round icon="edit" />
                  <q-btn size="12px" flat dense round icon="delete" />
                </div>
              </q-item-section>
            </q-item>
            </div>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useCategoryStore } from "src/stores/category-store";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/useNotify";
import useAuthUser from "src/composables/useAuthUser"

const { fetchPaginatedData } = useApi();
const { notifyError, notifySuccess } = useNotify();
const { user } = useAuthUser();
const tab = ref("mails");
const loading = ref(true);
const categoryStore = useCategoryStore();
const listCategory = ref([]);

const handleListCategory = async () => {
  try {
    loading.value = true;
    listCategory.value = await fetchPaginatedData("Categories", user.value.id, 0, 5);
  } catch (error) {
    notifyError(error.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  handleListCategory();
});

watch(
  () => tab.value,
  () => {
    if (tab.value == "mails") {
      categoryStore.type = true;
    }
    if (tab.value == "alarms") {
      categoryStore.type = false;
    }
  }
);
</script>