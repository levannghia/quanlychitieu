<template>
  <q-card style="height: 45vh; overflow-y: hidden">
    <q-linear-progress :value="1" color="secondary" />
    <q-card-section>
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
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <q-virtual-scroll
            style="max-height: 100vh"
            ref="virtualListThu"
            component="q-list"
            :items="listCategory"
            separator
            @virtual-scroll="onVirtualScroll"
            v-slot="{ item, index }"
          >
            <q-item
              v-if="item.type === true"
              clickable
              v-ripple
              @click="getCategory(item)"
              :key="index"
            >
              <q-item-section avatar>
                <q-avatar
                  color="positive"
                  text-color="white"
                  icon="monetization_on"
                />
              </q-item-section>

              <q-item-section>{{ item.name }}</q-item-section>
            </q-item>
          </q-virtual-scroll>
        </q-tab-panel>
        <q-tab-panel name="alarms">
          <q-virtual-scroll
            style="max-height: 100vh"
            ref="virtualListChi"
            component="q-list"
            :items="listCategory"
            separator
            @virtual-scroll="onVirtualScroll"
            v-slot="{ item, index }"
          >
            <q-item
              v-if="item.type === false"
              clickable
              v-ripple
              @click="getCategory(item)"
              :key="index"
            >
              <q-item-section avatar>
                <q-avatar
                  color="warning"
                  text-color="white"
                  icon="credit_card_off"
                />
              </q-item-section>

              <q-item-section> {{ item.name }}</q-item-section>
            </q-item>
          </q-virtual-scroll>
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, toRefs, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from "vue";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/useNotify";
import useAuthUser from "src/composables/useAuthUser";
import { useQuasar } from "quasar";
import {useCategoryStore} from "src/stores/category-store"

const { fetchPaginatedData, getById } = useApi();
const { notifyError, notifySuccess } = useNotify();
const { user } = useAuthUser();
const categoryStore = useCategoryStore()
const tab = ref("mails");
// const emit = defineEmits(['toggleDialog'])
// const openDialog = ref(true)

// const handleDialog = () => {
//   emit('toggleDialog', dialog.value)
//   openDialog.value = !openDialog.value
// }
const listCategory = ref([]);
const table = "Categories";

const virtualListThu = ref(null);
const virtualListChi = ref(null);
const virtualListIndex = ref(50);

const handleListCategory = async () => {
  try {
    listCategory.value = await fetchPaginatedData(table, user.value.id, 0, 5);
    console.log(listCategory.value);
  } catch (error) {
    notifyError(error.message);
  } finally {
  }
};

const getCategory = (item) => {
  categoryStore.selectedCategory.name = item.name
  categoryStore.selectedCategory.type = item.type
}

onMounted(() => {
  virtualListThu.value.scrollTo(virtualListIndex.value);
  handleListCategory();
});

const onVirtualScroll = ({ index }) => {
  virtualListIndex.value = index;
};

onBeforeUnmount(() => {
  if(categoryStore.selectedCategory.name == '' && categoryStore.selectedCategory.type == null){
    categoryStore.selectedCategory.name = listCategory.value[0].name
    categoryStore.selectedCategory.type = listCategory.value[0].type
  }
})
// const executeScroll = () => {
//   virtualListRef.value.scrollTo(virtualListIndex.value, "start-force");
// };

</script>
