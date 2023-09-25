<template>
  <q-page>
    <div class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-form @submit.prevent="handleCreateNote" class="q-gutter-md">
        <q-input bottom-slots filled autogrow v-model="form.description" label="Nội dung" counter>
          <template v-slot:prepend>
            <q-icon name="rate_review" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="descriptioform.description = ''" class="cursor-pointer" />
          </template>

          <template v-slot:hint> Field hint </template>
        </q-input>
        <div>
          <q-btn label="SAVE" type="submit" color="primary" :disable="loading" class="full-width" />
        </div>
      </q-form>

      <div class="q-mt-lg">
        <q-list v-for="note in listNotes" :key="note.id">
          <q-item tag="label" v-ripple clickable :disable="note.type ? true : false">
            <q-item-section side top>
              <q-checkbox v-model="note.type" @click="handleCheckNote(note)" :disable="note.type ? true : false"/>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ note.description }}</q-item-label>
            </q-item-section>

            <!-- <q-item-section side>
              <q-icon name="delete" color="red" @click="console.log('Test');"/>
            </q-item-section> -->
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onUnmounted, onMounted, ref } from "vue";
import { useCategoryStore } from "src/stores/category-store";
import useApi from "src/composables/useApi";
import useNotify from "src/composables/useNotify";
import useAuthUser from "src/composables/useAuthUser";
import useSupabase from "src/boot/supabase";

const { user } = useAuthUser();
const { fetchListData, updateById } = useApi();
const { notifyError, notifySuccess } = useNotify()
const { supabase } = useSupabase()
const categoryStore = useCategoryStore();
const table = 'writes';
const listNotes = ref([]);
const loading = ref(false);

const form = ref({
  type: false,
  date: null,
  description: "",
  userId: user.value.id
})

const handleCreateNote = async () => {
  try {
    if (form.value.description == "") {
      notifyError("Vui lòng nhập số tiền");
      return
    } else {
      loading.value = true
      const { data, error } = await supabase
        .from(table)
        .insert(form.value)
        .select();
      if (error) throw error
      // $q.loading.show()

      if (data) {
        notifySuccess("Thêm thành công!")
        setTimeout(() => {
          loading.value = false
          // $q.loading.hide()
        }, 800)

        // setTimeout(() => {
        //   router.push({ name: 'home' })
        // }, 900)
      }
    }
  } catch (error) {
    notifyError(error.message);
  } finally{
    form.value.description = ''
    handleListNote();
  }
}

const handleListNote = async () => {
  try {
    listNotes.value = await fetchListData(table, user.value.id);
  } catch (error) {
    notifyError(error.message);
  }
};

async function handleCheckNote(note) {
  try {
    form.value.id = note.id
    form.value.type = note.type
    let res = await updateById(table, form.value);
  } catch (error) {
    notifyError(error.message);
  }
}

handleListNote()

onMounted(() => {
  categoryStore.bcrumb = "Ghi chú";
});

onUnmounted(() => {
  categoryStore.bcrumb = "";
});
</script>

<style scoped></style>
