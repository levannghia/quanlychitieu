<template>
  <q-page>
    <div class="bg-primary" id="custom-money">
      <div class="text-white box-shadow q-pa-md row justify-between items-center">
        <div class="text-left">
          <span class="text-subtitle2">Số dư</span>
          <div class="text-h5 q-mt-sm">{{ totalsPrice }}</div>
        </div>
        <div class="text-right">
          <q-btn icon="event" round color="primary" v-if="filterDate.from.length > 0 && filterDate.to.length > 0">
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
      <q-virtual-scroll style="max-height: 72vh" ref="virtualListDate" component="q-list" :items="listUniqueDate"
        separator @virtual-scroll="onVirtualScroll" v-slot="{ item, index }">
        <transition-group appear enter-active-class="animated fadeIn slow" leave-active-class="animated fadeOut slow">
          <q-card class="q-mb-md" flat bordered :key="index">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-icon color="primary" size="md" name="event" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.date }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center"><span class="text-positive">+ {{ item.totals.true ? item.totals.true : 0
                }}</span></q-item-label>
                <q-item-label caption class="text-center">
                  Thu nhập
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-center"><span class="text-negative">- {{ item.totals.false ? item.totals.false :
                  0 }}</span></q-item-label>
                <q-item-label caption class="text-center">
                  Chi tiêu</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-12">
                <q-list>
                  <div v-for="note in item.notes" :key="note.id">
                    <q-item dense clickable @click="getLinkNote(note.id)">
                      <q-item-section avatar>
                        <q-avatar :color="note.categories.type ? 'positive' : 'warning'" text-color="white" :icon="note.categories.type
                          ? 'monetization_on'
                          : 'credit_card_off'
                          " />
                      </q-item-section>
                      <q-item-section>{{
                        note.categories.name
                      }}</q-item-section>
                      <q-item-section side>
                        <q-item-label caption><span :class="note.categories.type
                              ? 'text-primary'
                              : 'text-black'
                            ">{{ note.categories.type ? "+" : "-" }}
                            {{ note.price }}</span></q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator spaced inset />
                  </div>
                </q-list>
              </q-card-section>
            </q-card-section>
          </q-card>
        </transition-group>
      </q-virtual-scroll>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn :to="{ name: 'note.create' }" fab icon="add" color="primary" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import useAuthUser from "src/composables/useAuthUser";
import { onMounted, ref } from "vue";
import useSupabase from "src/boot/supabase";
import useNotify from "src/composables/useNotify";
import { useRouter } from "vue-router";

const router = useRouter();
const { user } = useAuthUser();
const { notifyError, notifySuccess } = useNotify();
const { supabase } = useSupabase();
const virtualListDate = ref(null);
const dateNow = ref("");
const totalsPrice = ref(0);
const numberPage = ref(0);
const sizePage = ref(10);
const listUniqueDate = ref([]);
getCurrentDay();
const filterDate = ref({
  from: "",
  to: "",
});
fecthAllDate();

const handleGetNoteByDate = async (page, pageSize) => {
  try {
    const { data, error } = await supabase
      .from("distinct_date_3")
      .select("date")
      .eq("userId", user.value.id)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order("date", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    notifyError(error.message);
  }
};

const getNoteForDate = async (date) => {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select(
        `
      id,
      price,
      categoryId,
    categories (
      name,
      type
    )
  `
      )
      .match({ userId: user.value.id, date: date })
      .order("created_at", { ascending: false }); // Thay thế bằng tên cột bạn muốn sắp xếp
    if (error) throw error;

    return data;
  } catch (error) {
    notifyError(error.message);
  }

};

const getListDate = async (page, size) => {
  let res = await handleGetNoteByDate(page, size);

  if (res.length > 0) {
    for (const row of res) {
      const date = row;

      let listNotes = await getNoteForDate(date.date);
      const totals = listNotes.reduce(
        (acc, item) => {
          const type = item.categories.type;
          acc[type] = acc[type] || 0;
          acc[type] += item.price;
          return acc;
        },
        {
          income: 0,
          expense: 0,
        }
      );

      const mergedObject = {
        date: date.date,
        notes: listNotes,
        totals: totals,
      };
      listUniqueDate.value.push(mergedObject);
    }
  }
};

// function onLoad(index, done) {
//   setTimeout(() => {
//     numberPage.value++;
//     getListDate(numberPage.value, sizePage.value);
//     done();
//   }, 1000);
// }

getListDate(numberPage.value, sizePage.value);

const onVirtualScroll = ({ index }) => {
  numberPage.value++;
  getListDate(numberPage.value, sizePage.value);
};

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

async function fecthAllDate() {
  try {
    const { data, error } = await supabase
      .from("distinct_date_3")
      .select("date")
      .eq("userId", user.value.id)
      .order("date", { ascending: false });
    if (error) throw error;
    if (data.length > 0) {
      filterDate.value = {
        from: data[data.length - 1].date,
        to: dateNow.value,
      };
    } else {
      filterDate.value = {
        from: dateNow.value,
        to: dateNow.value,
      };
    }
  } catch (error) {
    notifyError(error.message);
  }
}

const getTotalsPrice = async () => {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select(
        `
      price,
      date,
    categories (
      type
    )
  `
      )
      .eq("userId", user.value.id)
      .gte("date", filterDate.value.from)
      .lte("date", filterDate.value.to);
    if (error) throw error;
    let tong = 0;
    let hieu = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].categories.type === true) {
        tong += data[i].price;
      } else {
        hieu += data[i].price;
      }
    }
    totalsPrice.value = tong - hieu;
    return data;
  } catch (error) {
    notifyError(error.message);
  }
};

onMounted(() => {
  setTimeout(() => {
    getTotalsPrice();
  }, 2000);
});

const save = () => {
  getTotalsPrice();
};

function getLinkNote(id) {
  router.push({ name: "note.edit", params: { id: id } });
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
