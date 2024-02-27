<template>
  <TaskTableDesktop
    v-if="$q.screen.gt.sm"
    :tasks="tasks"
    @start="startTimer"
    @finish="finishEarly"
    @empty="emptyLocalStorage"
  />
  <TaskTableMobile
    v-else
    :tasks="tasks"
    @start="startTimer"
    @finish="finishEarly"
    @empty="emptyLocalStorage"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useTasks } from '../stores/tasks';
import { Task } from '../types';
import TaskTableDesktop from './TaskTableDesktop.vue';
import TaskTableMobile from './TaskTableMobile.vue';

const $q = useQuasar();

const tasksStore = useTasks();

const tasks = ref<Task[]>(tasksStore.getTasksSortedByStatus);

tasksStore.$subscribe(() => {
  tasks.value = [];
  tasks.value = tasksStore.getTasksSortedByStatus;
});

const startTimer = (taskId: number) => {
  tasksStore.startTask(taskId);
};

const finishEarly = () => {
  tasksStore.finishCurrentTaskEarly();
};

const emptyLocalStorage = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete all tasks?',
    ok: 'Yes',
  }).onOk(() => {
    $q.localStorage.remove('tasks');
    tasksStore.$reset();
  });
};
</script>

<style>
.q-table tbody td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 10vw;
}
.q-table thead tr {
  height: 65px;
}
.q-table tbody td {
  height: 60px;
}

.q-table th,
.q-table td {
  padding: 10px 20px;
}
</style>

<style lang="sass">
.sticky-header-table
  /* height or max-height is important */
  height: 50vh

  .q-table__top
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

  thead tr th
    position: sticky
    z-index: 1
    border-bottom-width: 1.25px
    border-color: rgba(0, 0, 0, 0.25)
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px

@media (max-width: $breakpoint-sm-max)
  .sticky-header-table
    height: calc(100vh - 168px)
</style>
