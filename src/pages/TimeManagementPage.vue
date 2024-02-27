<template>
  <q-page>
    <q-tab-panels
      v-model="tabState"
      swipeable
      class="height-class"
      style="background: none"
    >
      <q-tab-panel
        name="main"
        class="row content-between items-center q-py-md q-px-lg q-px-md-xl q-py-md-lg overflow-hidden height-class"
      >
        <div class="col-12 col-md-6">
          <Transition appear enter-active-class="animated slideInLeft slower">
            <div class="text-left text-white my-title-xl">
              Simple Task Manager
            </div>
          </Transition>
        </div>
        <div class="gt-sm col-md-5 offset-md-1">
          <Transition appear enter-active-class="animated slideInDown slower">
            <TaskForm class="q-ml-auto q-mt-auto" />
          </Transition>
        </div>
        <div class="gt-sm col-md-6">
          <Transition appear enter-active-class="animated slideInUp slower">
            <TaskList />
          </Transition>
        </div>
        <div
          class="col-12 col-md-5 offset-md-1 q-px-none q-px-sm-xl q-px-md-none"
        >
          <Transition appear enter-active-class="animated slideInRight slower">
            <TaskTimeCard
              class="q-mx-none q-mx-sm-xl q-mr-md-none q-ml-md-auto"
              :style="`opacity: ${fabState ? 0 : 1}`"
            />
          </Transition>
        </div>
      </q-tab-panel>
      <q-tab-panel name="list">
        <div class="t-md" :style="`opacity: ${fabState ? 0 : 1}`">
          <Transition appear enter-active-class="animated zoomIn">
            <TaskList />
          </Transition>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <div class="lt-md q-pa-md fab-position">
      <q-fab
        v-model="fabState"
        square
        color="blue-grey-8"
        icon="add"
        @show="showAddTaskDialog"
        @hide="hideAddTaskDialog"
      />
    </div>
    <q-footer class="lt-md bg-blue-10 text-white footer-position shadow-2">
      <q-tabs v-model="tabState">
        <q-tab name="main" icon="timer" />
        <q-tab name="list" icon="list" />
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar, DialogChainObject } from 'quasar';
import TaskList from '../components/TaskList.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskTimeCard from '../components/TaskTimeCard.vue';
import TaskFormDialog from '../components/TaskFormDialog.vue';

const $q = useQuasar();

const tab = ref('main');
const tabState = computed({
  get: () => tab.value,
  set: (val) => {
    if ($q.screen.lt.md) tab.value = val;
  },
});

const fabState = ref(false);
const addTaskDialogInstance = ref<DialogChainObject | null>(null);
const showAddTaskDialog = () => {
  addTaskDialogInstance.value = $q
    .dialog({
      component: TaskFormDialog,
    })
    .onOk(() => {
      addTaskDialogInstance.value = null;
      fabState.value = false;
    })
    .onCancel(() => {
      addTaskDialogInstance.value = null;
      fabState.value = false;
    })
    .onDismiss(() => {
      addTaskDialogInstance.value = null;
      fabState.value = false;
    });
};
const hideAddTaskDialog = () => addTaskDialogInstance.value?.hide();
</script>

<style lang="scss">
.height-class {
  height: 100vh;
}

@media (max-width: $breakpoint-sm-max) {
  .height-class {
    height: 80vh;
  }

  .fab-position {
    position: fixed;
    bottom: 48px;
    right: 0px;
  }

  .footer-position {
    position: fixed;
    bottom: 0px;
  }
}
</style>
