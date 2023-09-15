<template>
  <q-page>
    <div class="bg-primary" id="custom-money-note">
      <div class="text-white box-shadow q-pa-md row justify-between items-center">
        <div class="text-left">
          <q-btn :icon="form.category.type ? 'monetization_on' : 'credit_card_off'
            " round :color="form.category.type ? 'positive' : 'warning'" @click="handleDialog"></q-btn>
          <div class="text-subtitle1 q-mt-sm">{{ form.category.name }}</div>
        </div>
        <div class="text-right">
          <div class="text-h6" @click="toggleCalculator = !toggleCalculator">
            {{ calculatorStore.tempResult === "" ? form.price : calculatorStore.tempResult }} <q-icon name="expand_more" />
          </div>
          <div class="text-subtitle1 q-mt-sm">{{ repCalculation }} =</div>
        </div>
      </div>
    </div>
    <q-card>
      <q-card-section>
        <div class="q-pa-sm q-mx-auto" style="max-width: 400px">
          <q-form class="q-gutter-md">
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
    <q-page-sticky position="bottom-right" :offset="[18, 18]" style="z-index: 99;">
      <q-btn @click="handleUpdateNote" fab :icon="btnIcon" color="secondary" :disable="loading"/>
    </q-page-sticky>
    <q-page-sticky position="bottom-left" :offset="[18, 18]" style="z-index: 99;">
      <q-btn @click="handleRemoveNote(form.id)" fab icon="delete" color="negative" />
    </q-page-sticky>
    <q-dialog v-model="openDialog" @click="handleDialog" position="bottom">
      <list-category-2 :listCategory="listCategory" @getCategory="handleGetCategory"></list-category-2>
    </q-dialog>

    <calculator v-if="toggleCalculator"></calculator>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import useAuthUser from "src/composables/useAuthUser";
import useSupabase from "src/boot/supabase";
import useNotify from "src/composables/useNotify";
import { useRouter, useRoute } from "vue-router";
import useApi from "src/composables/useApi";
import ListCategory2 from "src/components/ListCategory2.vue";
import Calculator from "src/components/Calculator.vue";
import { useCalculatorStore } from "src/stores/calculator-store";
import { useQuasar } from 'quasar'

const calculatorStore = useCalculatorStore();
const { fetchListData, getById, removeById } = useApi();
const { notifyError, notifySuccess } = useNotify()
const { supabase } = useSupabase()
const $q = useQuasar();
const { user } = useAuthUser();
const loading = ref(false)
const btnIcon = ref('done')
const openDialog = ref(false);
const router = useRouter();
const route = useRoute();
const listCategory = ref([]);
const table = "categories";
const toggleCalculator = ref(true);
const form = ref({
  id: null,
  userId: "",
  date: null,
  description: "",
  price: null,
  category: {
    id: null,
    name: "",
    type: false
  },
})

const handleDialog = () => {
  openDialog.value = !openDialog.value;
};

const handleGetNoteById = async () => {
  try {
    let res = await getById('notes', route.params.id, user.value.id);
    form.value.id = res.id;
    form.value.date = res.date;
    form.value.userId = res.userId;
    form.value.description = res.description;
    form.value.category.id = res.categories.id;
    form.value.category.name = res.categories.name;
    form.value.category.type = res.categories.type;
    form.value.price = res.price;
  } catch (error) {
    notifyError(error.message)
  }
}

const handleRemoveNote = async (id) => {
  try {
    $q.dialog({
      title: 'Xác nhận',
      message: `Bạn muốn xóa ghi chú này ?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await removeById("notes",id)
      router.push({name: 'home'})
      // handleListCategory()
    })
  } catch (error) {
    notifyError(error.message)
  }
}

const handleUpdateNote = async () => {

  if(Object.keys(calculatorStore.tempResult).length > 0){
    form.value.price = calculatorStore.tempResult
  }

  try {
    if (form.value.price == null) {
      notifyError("Vui lòng nhập số tiền");
      return
    } else {
      loading.value = true
      const { data, error } = await supabase
        .from('notes')
        .update({
          price: form.value.price,
          description: form.value.description,
          date: form.value.date,
          categoryId: form.value.category.id
        })
        .match({ id: form.value.id })
        .select();
      if (error) throw error
      $q.loading.show()

      if (data) {
        notifySuccess("Thêm thành công!")
        setTimeout(() => {
          loading.value = false
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

// watch(
//   () => openDialog.value,
//   () => {
//     if (Object.keys(selectedCategory.value).length === 0) {
//       selectedCategory.value = listCategory.value[0];
//     }
//   }
// );

const handleGetCategory = (item) => {
  form.value.category.id = item.id
  form.value.category.name = item.name
  form.value.category.type = item.type
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

handleGetNoteById();
handleListCategory();
// onMounted(() => {});

</script>

<style scoped>
#custom-money-note{
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}
</style>
