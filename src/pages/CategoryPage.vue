<template>
  <q-page class="q-pa-md">
    <div style="max-width: 600px">
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

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails">
          <q-list>
            <q-item v-ripple>
              <q-item-section avatar>
                <q-avatar color="teal" text-color="white" icon="bluetooth" />
              </q-item-section>

              <q-item-section>Avatar-type icon</q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="edit"
                  />
                  <q-btn
                   
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="alarms">
         <q-list>
            <q-item v-ripple>
              <q-item-section avatar>
                <q-avatar color="teal" text-color="white" icon="bluetooth" />
              </q-item-section>

              <q-item-section>Avatar-type icon</q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    
                    size="12px"
                    flat
                    dense
                    round
                    icon="edit"
                  />
                  <q-btn
                   
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useCategoryStore } from 'src/stores/category-store';

const tab = ref('mails');
const categoryStore = useCategoryStore()

watch(() => tab.value, () => {
    if(tab.value == 'mails'){
        categoryStore.type = true
    }
    if(tab.value == 'alarms'){
        categoryStore.type = false
    }
})
</script>