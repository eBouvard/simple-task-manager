<template>
  <div class="fullscreen bg-blue">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useTasks } from 'src/stores/tasks';

const $q = useQuasar();

const tasksStore = useTasks();

const runningTask = tasksStore.getRunningTask;
if (runningTask) {
  tasksStore.updateRunningTask();
}

tasksStore.$subscribe((_, state) => {
  try {
    $q.localStorage.set('tasks', state);
  } catch (e) {
    console.error(e);
  }
});
</script>
