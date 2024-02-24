<template>
  <q-page
    class="column justify-between items-center q-px-xl q-py-lg overflow-hidden"
  >
    <div class="col-4 full-width">
      <div
        class="row justify-between items-center"
        style="height: -webkit-fill-available"
      >
        <div class="col-7">
          <Transition appear enter-active-class="animated slideInLeft slower">
            <div class="text-left text-white my-title-xl">
              Simple Task Manager
            </div>
          </Transition>
        </div>
        <div class="col-5">
          <Transition appear enter-active-class="animated slideInDown slower">
            <TaskForm class="q-ml-auto q-mt-auto" />
          </Transition>
        </div>
      </div>
    </div>
    <div class="col-6 full-width">
      <div
        class="row justify-between items-center"
        style="height: -webkit-fill-available"
      >
        <div class="col-7">
          <Transition appear enter-active-class="animated slideInUp slower">
            <TaskList />
          </Transition>
        </div>
        <div class="col-5">
          <Transition appear enter-active-class="animated slideInRight slower">
            <TaskTimeCard class="q-ml-auto" />
          </Transition>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TaskList from '../components/TaskList.vue';
import TaskForm from '../components/TaskForm.vue';
import TaskTimeCard from '../components/TaskTimeCard.vue';
</script>
