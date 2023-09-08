<template>
  <q-page>
    <div class="bg-primary" id="custom-money">
      <div
        class="text-white box-shadow q-pa-md row justify-between items-center"
      >
        <div class="text-left">
          <span class="text-subtitle2">Số dư</span>
          <div class="text-h5 q-mt-sm">10.000</div>
        </div>
        <div class="text-right">
          <q-btn icon="event" round color="primary">
            <q-popup-proxy
              @before-show="filterDate"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="filterDate" range mask="YYYY-MM-DD">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn
                    label="OK"
                    color="primary"
                    flat
                    @click="save"
                    v-close-popup
                  />
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
                <q-item-label>2023-09-08</q-item-label>
                <q-item-label class="text-subtitle2"
                  ><span class="text-secondary">200000</span></q-item-label
                >
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center"
                  ><span class="text-positive">+ 150000</span></q-item-label
                >
                <q-item-label caption class="text-center">
                  Thu nhập
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center"
                  ><span class="text-negative">- 150000</span></q-item-label
                >
                <q-item-label caption class="text-center">
                  Chi tiêu</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-12">
                <q-list>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        color="positive"
                        text-color="white"
                        icon="monetization_on"
                      />
                    </q-item-section>
                    <q-item-section>List item</q-item-section>
                    <q-item-section side>
                      <q-item-label caption
                        ><span class="text-black">- 150000</span></q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-separator spaced inset />
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        color="warning"
                        text-color="white"
                        icon="monetization_on"
                      />
                    </q-item-section>
                    <q-item-section>List item</q-item-section>
                    <q-item-section side>
                      <q-item-label caption
                        ><span class="text-primary"
                          >+ 150000</span
                        ></q-item-label
                      >
                    </q-item-section>
                  </q-item>
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
getCurrentDay();
const filterDate = ref({ from: "2023-08-07", to: dateNow.value });



function onLoad(index, done) {
  setTimeout(() => {
    listUniqueDate.value.push({}, {}, {}, {}, {}, {}, {});
    done();
  }, 2000);
}

const handleGetNoteByDate = async () => {
  try {
    const { data, error } = await supabase
      .from("distinct_date_3")
      .select('date')
      .eq('userId', user.value.id)
      .order('date', { ascending: false });
    if (error) throw error;
    listUniqueDate.value = data
  } catch (error) {
    notifyError(error.message);
    console.log(error.message);
  }
};

onMounted(() => {handleGetNoteByDate()});

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
