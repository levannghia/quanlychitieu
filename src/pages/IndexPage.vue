<template>
  <q-page>
    <div class="bg-primary" id="custom-money">
      <div class="text-white box-shadow q-pa-md row justify-between items-center">
        <div class="text-left">
          <span class="text-subtitle2">Số dư</span>
          <div class="text-h5 q-mt-sm">10.000</div>
        </div>
        <div class="text-right">
          <q-btn icon="event" round color="primary">
            <q-popup-proxy @before-show="filterDate" cover transition-show="scale" transition-hide="scale">
              <q-date v-model="filterDate" range mask="DD-MM-YYYY">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
          <div class="q-mt-xs">
            <q-badge> {{ filterDate.from }} <q-icon name="arrow_right_alt" /> {{ filterDate.to }} </q-badge>
          </div>
        </div>
      </div>
    </div>
    <div class="q-pa-sm">
      <div class="q-pa-md row justify-center">
        <q-input style="min-width: 10em" type="number" v-model.number="virtualListIndex" :min="0" :max="9999"
          label="Scroll to index" input-class="text-right" outlined />
        <q-btn class="q-ml-sm" label="Go" no-caps color="primary" @click="executeScroll" />
      </div>

      <q-separator />

      <q-virtual-scroll ref="virtualListRef" style="max-height: 100vh" component="q-list" :items="heavyList" separator
        @virtual-scroll="onVirtualScroll" v-slot="{ item, index }">
        <q-item :key="index" dense :class="{ 'bg-black text-white': index === virtualListIndex }">
          <q-item-section>
            <q-item-label> #{{ index }} - {{ item.label }} </q-item-label>
          </q-item-section>
        </q-item>
      </q-virtual-scroll>
    </div>
  </q-page>
</template>

<script setup>
import useAuthUser from "src/composables/useAuthUser";
import { ref, onMounted } from "vue";

const { user } = useAuthUser();
const maxSize = 1000;
const heavyList = [];
const dateNow = ref('');
getCurrentDay()
const filterDate = ref({ from: "08-07-2023", to: dateNow.value });

for (let i = 0; i < maxSize; i++) {
  heavyList.push({
    label: "Option " + (i + 1),
  });
}

const virtualListRef = ref(null);
const virtualListIndex = ref(50);

onMounted(() => {
  virtualListRef.value.scrollTo(virtualListIndex.value);
});

function getCurrentDay(){
    const currentDate = new Date();

    // Lấy ngày, tháng và năm từ đối tượng Date
    const day = String(currentDate.getDate()).padStart(2, '0'); // Lấy ngày và định dạng thành "DD"
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Lấy tháng (lưu ý: tháng bắt đầu từ 0) và định dạng thành "MM"
    const year = currentDate.getFullYear(); // Lấy năm và không cần định dạng

    // Tạo chuỗi "DD-MM-YYYY" từ các giá trị trên
    const formattedDate = `${day}-${month}-${year}`;
    dateNow.value = formattedDate
}

console.log(filterDate.value);

const onVirtualScroll = ({ index }) => {
  virtualListIndex.value = index;
  console.log("test");
};

const executeScroll = () => {
  virtualListRef.value.scrollTo(virtualListIndex.value, "start-force");
};
</script>

<style>
#custom-money {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}
</style>
