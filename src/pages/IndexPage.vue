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
              <q-date v-model="filterDate" range mask="YYYY-MM-DD">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
          <div class="q-mt-xs">
            <q-badge>
              {{ filterDate.from }} <q-icon name="arrow_right_alt" />
              {{ filterDate.to }}
            </q-badge>
          </div>
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <q-infinite-scroll @load="onLoad" :offset="250">
        <div v-for="(item, index) in listUniqueDate" :key="index">
          <q-card class="q-mb-md" flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-icon color="primary" size="md" name="event" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.date }}</q-item-label>
                <q-item-label class="text-subtitle2"><span class="text-secondary">200000</span></q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center"><span class="text-positive">+ 150000</span></q-item-label>
                <q-item-label caption class="text-center">
                  Thu nhập
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center"><span class="text-negative">- 150000</span></q-item-label>
                <q-item-label caption class="text-center">
                  Chi tiêu</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-12">
                <q-list>
                  <div v-for="note in item.notes" :key="note.id">
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar color="positive" text-color="white" icon="monetization_on" />
                      </q-item-section>
                      <q-item-section>List item</q-item-section>
                      <q-item-section side>
                        <q-item-label caption><span class="text-black">- 150000</span></q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                  </div>
                </q-list>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn :to="{ name: 'note.create' }" fab icon="add" color="primary" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import useAuthUser from "src/composables/useAuthUser";
import { ref, onMounted } from "vue";
import useSupabase from "src/boot/supabase";
import useNotify from "src/composables/useNotify";

const { user } = useAuthUser();
const { notifyError, notifySuccess } = useNotify()
const { supabase } = useSupabase();
const dateNow = ref("");
const listUniqueDate = ref([])
const numberPage = ref(-1);
const sizePage = ref(7);
getCurrentDay();
const filterDate = ref({ from: "2023-08-07", to: dateNow.value });

const handleGetNoteByDate = async (page, pageSize) => {
  try {
    const { data, error } = await supabase
      .from("distinct_date_3")
      .select('date')
      .eq('userId', user.value.id)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('date', { ascending: false });
    if (error) throw error;
    return data
  } catch (error) {
    notifyError(error.message);
  }
};

const getNoteForDate = async (date) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select(`
    price,
    categories (
      name,
      type
    )
  `)
      .match({ userId: user.value.id, date: date })
      .order('created_at', { ascending: false }); // Thay thế bằng tên cột bạn muốn sắp xếp

    if (error) throw error
    return data;
  } catch (error) {
    notifyError(error.message)
  }
}

const getListDate = async (page, size) => {
  let res = await handleGetNoteByDate(page, size)

  if (res.length > 0) {
    for (const row of res) {
      const date = row;

      let listNotes = await getNoteForDate(date.date)

      const mergedObject = {
        date: date.date,
        notes: listNotes
      }
      listUniqueDate.value.push(mergedObject)
    }
  }

  console.log(listUniqueDate.value);

}

function onLoad(index, done) {
  setTimeout(() => {
    numberPage.value++
    getListDate(numberPage.value, sizePage.value)
    done();
  }, 1000);

}
onMounted(() => {

});

function getCurrentDay() {
  const currentDate = new Date();

  // Lấy ngày, tháng và năm từ đối tượng Date
  const day = String(currentDate.getDate()).padStart(2, "0"); // Lấy ngày và định dạng thành "DD"
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Lấy tháng (lưu ý: tháng bắt đầu từ 0) và định dạng thành "MM"
  const year = currentDate.getFullYear(); // Lấy năm và không cần định dạng

  // Tạo chuỗi "DD-MM-YYYY" từ các giá trị trên
  const formattedDate = `${year}-${month}-${day}`;
  dateNow.value = formattedDate;
}
</script>

<style>
#custom-money {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}
</style>
