<template>
  <q-page>
    <div style="max-width: 600px">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="mails" label="Khoảng thu" no-caps />
        <q-tab name="alarms" label="Khoản chi" no-caps />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <q-list>
            <div v-for="(category, index) in listCategory" :key="index">
              <transition-group appear enter-active-class="animated fadeIn slow"
                leave-active-class="animated fadeOut slow">
                <q-item v-ripple v-if="category.type === true">
                  <q-item-section avatar>
                    <q-avatar color="positive" text-color="white" icon="monetization_on" />
                  </q-item-section>

                  <q-item-section>{{ category.name }}</q-item-section>
                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn size="12px" flat dense round icon="edit" color="secondary"
                        @click="handleGetCategory(category)" />
                      <q-btn size="12px" flat dense round icon="delete" color="negative"
                        @click="handleRemoveCategory(category)" />
                    </div>
                  </q-item-section>
                </q-item>
              </transition-group>
            </div>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <q-list>
            <div v-for="(category, index) in listCategory" :key="index">
              <transition-group appear enter-active-class="animated fadeIn slow"
                leave-active-class="animated fadeOut slow">
                <q-item v-ripple v-if="category.type === false">
                  <q-item-section avatar>
                    <q-avatar color="warning" text-color="white" icon="credit_card_off" />
                  </q-item-section>

                  <q-item-section>{{ category.name }}</q-item-section>
                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn size="12px" flat dense round icon="edit" color="secondary"
                        @click="handleGetCategory(category)" />
                      <q-btn size="12px" flat dense round icon="delete" color="negative"
                        @click="handleRemoveCategory(category)" />
                    </div>
                  </q-item-section>
                </q-item>
              </transition-group>
            </div>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useCategoryStore } from "src/stores/category-store";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/useNotify";
import useAuthUser from "src/composables/useAuthUser"
import { useQuasar } from 'quasar'

const { fetchPaginatedData, getById, removeById } = useApi();
const { notifyError, notifySuccess } = useNotify();
const { user } = useAuthUser();
const tab = ref("");
const loading = ref(true);
const categoryStore = useCategoryStore();
const listCategory = ref([]);
const $q = useQuasar();
const table = "Categories";
const form = ref({
  name: ''
})

onBeforeMount(() => {
  if(categoryStore.type){
    tab.value = "mails"
  }else{
    tab.value = "alarms"
  }
})

const handleRemoveCategory = async (category) => {
  try {
    $q.dialog({
      title: 'Xác nhận',
      message: `Bạn muốn xóa danh mục ${category.name} ?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await removeById(table, category.id)
      notifySuccess('Xóa thành công')
      handleListCategory()
    })
  } catch (error) {
    notifyError(error.message)
  }
}

const handleUpdateCategort = async (category) => {
  try {

  } catch (error) {
    notifyError(error.message)
  }
}

const handleGetCategory = async (category) => {
  const data = await getById(table, category.id);
  console.log(data);
}

const handleListCategory = async () => {
  try {
    loading.value = true;
    listCategory.value = await fetchPaginatedData(table, user.value.id, 0, 5);
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
