<template>
  <q-page>
    <div
      class="row justify-between items-center q-py-md q-px-lg q-px-md-xl q-py-md-lg q-gutter-y-md overflow-hidden height-class"
    >
      <div class="col-12 col-md-6">
        <Transition appear enter-active-class="animated slideInLeft slower">
          <div class="text-left text-white my-title-xl">
            Simple Task Manager
          </div>
        </Transition>
      </div>
      <div class="gt-sm col-md-4 offset-md-2">
        <Transition appear enter-active-class="animated slideInDown slower">
          <TaskForm class="q-ml-auto q-mt-auto" />
        </Transition>
      </div>
      <div class="gt-sm col-md-6">
        <Transition appear enter-active-class="animated slideInUp slower">
          <TaskList />
        </Transition>
      </div>
      <div class="col-12 col-md-4 offset-md-2">
        <Transition appear enter-active-class="animated slideInRight slower">
          <TaskTimeCard class="q-ml-auto" />
        </Transition>
      </div>
    </div>
    <div class="lt-md q-pa-md fab-position">
      <q-fab square color="blue-grey" icon="add" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TaskList from '../components/TaskList.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskTimeCard from '../components/TaskTimeCard.vue';
</script>

<style lang="scss">
.height-class {
  height: 100vh;
}

@media (max-width: $breakpoint-md-max) {
  .height-class {
    height: 80vh;
  }

  .fab-position {
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
}
</style>
