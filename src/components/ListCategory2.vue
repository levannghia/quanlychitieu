<template>
  <q-card style="height: 45vh; overflow-y: hidden;">
    <q-linear-progress :value="1" color="secondary" />
    <q-card-section>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="mails" label="Khoảng thu" no-caps />
        <q-tab name="alarms" label="Khoản chi" no-caps />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <q-virtual-scroll style="max-height: 40vh;" ref="virtualListThu" component="q-list" :items="listCategory"
            separator @virtual-scroll="onVirtualScroll" v-slot="{ item, index }">
            <q-item v-if="item.type === true" clickable v-ripple @click="getCategory(item)" :key="index">
              <q-item-section avatar>
                <q-avatar color="positive" text-color="white" icon="monetization_on" />
              </q-item-section>

              <q-item-section>{{ item.name }}</q-item-section>
            </q-item>
          </q-virtual-scroll>
        </q-tab-panel>
        <q-tab-panel name="alarms">
          <q-virtual-scroll style="max-height: 40vh;" ref="virtualListChi" component="q-list" :items="listCategory"
            separator @virtual-scroll="onVirtualScroll" v-slot="{ item, index }">
            <q-item v-if="item.type === false" clickable v-ripple @click="getCategory(item)" :key="index">
              <q-item-section avatar>
                <q-avatar color="warning" text-color="white" icon="credit_card_off" />
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
import { ref, toRefs, onMounted } from "vue"


const tab = ref("mails");
const props = defineProps({
  listCategory: {
    type: Array
  }
})
const emit = defineEmits(['getCategory'])
// const openDialog = ref(true)

// const handleDialog = () => {
//   emit('toggleDialog', dialog.value)
//   openDialog.value = !openDialog.value
// }
const { listCategory } = toRefs(props);

const virtualListThu = ref(null);
const virtualListChi = ref(null);
const virtualListIndex = ref(50);

function getCategory(item) {
  emit('getCategory', item)
}

const onVirtualScroll = ({ index }) => {
  virtualListIndex.value = index;
  console.log("test");
};

</script>
<style scoped>
.q-tab-panel {
  padding: 0 !important;
}
</style>
