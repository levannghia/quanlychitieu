<template>
  <q-page>
    <div class="bg-primary" id="custom-money-note">
      <div class="text-white box-shadow q-pa-md row justify-between items-center">
        <div class="text-left">
          <q-btn :icon="selectedCategory.type ? 'monetization_on' : 'credit_card_off'
            " round :color="selectedCategory.type ? 'positive' : 'warning'" @click="handleDialog"></q-btn>
          <div class="text-subtitle1 q-mt-sm">{{ selectedCategory.name }}</div>
        </div>
        <div class="text-right">
          <div class="text-h6" @click="toggleCalculator = !toggleCalculator">
            {{ calculatorStore.tempResult }} <q-icon name="expand_more" />
          </div>
          <div class="text-subtitle1 q-mt-sm">{{ repCalculation }} =</div>
        </div>
      </div>
    </div>
    <q-card>
      <q-card-section>
        <div class="q-pa-sm q-mx-auto" style="max-width: 400px">
          <q-form @submit.prevent="" class="q-gutter-md">
            <q-input filled v-model="form.date" readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.date" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input v-model="form.description" filled autogrow>
              <template v-slot:append>
                <q-icon name="description" />
              </template>
            </q-input>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="handleCreateNote" fab :icon="btnIcon" color="primary" />
    </q-page-sticky>
    <q-dialog v-model="openDialog" @click="handleDialog" position="bottom">
      <list-category-2 :listCategory="listCategory" @getCategory="handleGetCategory"></list-category-2>
    </q-dialog>

    <calculator v-if="toggleCalculator"></calculator>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch, computed, onBeforeUnmount } from "vue";
// import { useCategoryStore } from "src/stores/category-store";
import useAuthUser from "src/composables/useAuthUser";
import useSupabase from "src/boot/supabase";
import useNotify from "src/composables/useNotify";
import { useRouter } from "vue-router";
import useApi from "src/composables/useApi";
import ListCategory2 from "src/components/ListCategory2.vue";
import Calculator from "src/components/Calculator.vue";
import { useCalculatorStore } from "src/stores/calculator-store";
import { useQuasar } from 'quasar'

const calculatorStore = useCalculatorStore();
const { fetchListData } = useApi();
const { notifyError, notifySuccess } = useNotify()
const { supabase } = useSupabase()
const $q = useQuasar();
const { user } = useAuthUser();
// const categoryStore = useCategoryStore();
const btnIcon = ref('done')
const openDialog = ref(true);
const selectedCategory = ref({});
const router = useRouter();
const listCategory = ref([]);
const table = "categories";
const toggleCalculator = ref(true);
const dateNow = ref('');
getCurrentDay()
const form = ref({
  date: dateNow.value,
  description: "",
  price: null,
  categoryId: null,
  userId: user.value.id
})

const handleDialog = () => {
  openDialog.value = !openDialog.value;
};

function getCurrentDay() {
  const currentDate = new Date();

  // Lấy ngày, tháng và năm từ đối tượng Date
  const day = String(currentDate.getDate()).padStart(2, '0'); // Lấy ngày và định dạng thành "DD"
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Lấy tháng (lưu ý: tháng bắt đầu từ 0) và định dạng thành "MM"
  const year = currentDate.getFullYear(); // Lấy năm và không cần định dạng

  // Tạo chuỗi "YYYY-MM-DD" từ các giá trị trên
  const formattedDate = `${year}-${month}-${day}`;
  dateNow.value = formattedDate
}

const handleCreateNote = async () => {
  form.value.categoryId = selectedCategory.value.id
  form.value.price = calculatorStore.tempResult
  try {
    if (form.value.price == "") {
      notifyError("Vui lòng nhập số tiền");
      return
    } else {
      const { data, error } = await supabase
        .from('notes')
        .insert(form.value)
        .select();
      if (error) throw error
      $q.loading.show()

      if (data) {
        notifySuccess("Thêm thành công!")
        setTimeout(() => {
          $q.loading.hide()
        }, 800)

        setTimeout(() => {
          router.push({ name: 'home' })
        }, 900)
      }
    }
  } catch (error) {
    notifyError(error.message);
  }
}

watch(
  () => openDialog.value,
  () => {
    if (Object.keys(selectedCategory.value).length === 0) {
      selectedCategory.value = listCategory.value[0];
    }
  }
);

const handleGetCategory = (item) => {
  selectedCategory.value = item;
  openDialog.value = false;
};

const repCalculation = computed(() => {
  return calculatorStore.calculation
    .replaceAll("*", "x")
    .replaceAll("x", " x ")
    .replaceAll("/", " / ")
    .replaceAll("+", " + ")
    .replaceAll("-", " - ");
});

const handleListCategory = async () => {
  try {
    listCategory.value = await fetchListData(table, user.value.id);
  } catch (error) {
    notifyError(error.message);
  } finally {
  }
};

handleListCategory();
onMounted(() => { });

onBeforeUnmount(() => {
  calculatorStore.calculation = ""
  calculatorStore.tempResult = ""
})
</script>
