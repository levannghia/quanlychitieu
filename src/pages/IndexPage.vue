<template>
  <q-page>
    <div class="bg-primary" id="custom-money">
      <div class="text-h4 text-left text-white box-shadow q-pa-md">
        10.000
      </div>
    </div>
    <div class="q-pa-sm">
      <div class="q-pa-md row justify-center">
        <q-input style="min-width: 10em" type="number" v-model.number="virtualListIndex" :min="0" :max="9999"
          label="Scroll to index" input-class="text-right" outlined />
        <q-btn class="q-ml-sm" label="Go" no-caps color="primary" @click="executeScroll" />
      </div>

      <q-separator />

      <q-virtual-scroll ref="virtualListRef" style="max-height: 100vh;" component="q-list" :items="heavyList" separator
        @virtual-scroll="onVirtualScroll" v-slot="{ item, index }">
        <q-item :key="index" dense :class="{ 'bg-black text-white': index === virtualListIndex }">
          <q-item-section>
            <q-item-label>
              #{{ index }} - {{ item.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-virtual-scroll>
    </div>
  </q-page>
</template>

<script setup>
import useAuthUser from 'src/composables/useAuthUser';
import { ref, onMounted } from 'vue'

const { user } = useAuthUser()
const maxSize = 1000
const heavyList = []

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: 'Option ' + (i + 1)
  })
}


const virtualListRef = ref(null)
const virtualListIndex = ref(50)

onMounted(() => {
  virtualListRef.value.scrollTo(virtualListIndex.value)

})


const onVirtualScroll = ({ index }) => {
  virtualListIndex.value = index
  console.log("test");
}

const executeScroll = () => {
  virtualListRef.value.scrollTo(virtualListIndex.value, 'start-force')
}

</script>

<style>
#custom-money{
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}
</style>
