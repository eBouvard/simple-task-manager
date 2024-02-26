<template>
  <q-table
    class="sticky-header-table"
    title-class="my-title"
    :columns="columns"
    :rows="tasks"
    row-key="id"
    hide-bottom
    virtual-scroll
    v-model:pagination="pagination"
    :rows-per-page-options="[0]"
  >
    <template v-slot:header-cell-actions>
      <q-th class="text-center">
        <q-btn
          @click="emptyLocalStorage"
          class="q-my-xs"
          color="negative"
          flat
          icon="o_delete"
          size="md"
        />
      </q-th>
    </template>
    <template v-slot:body-cell-actions="rows">
      <q-td class="flex flex-center">
        <q-btn
          v-if="rows.row.status === TaskStatus.Pending"
          @click="startTimer(rows.row.id)"
          class="q-my-xs"
          color="green"
          outline
          round
          icon="play_arrow"
          size="sm"
        />
        <q-icon
          v-else-if="rows.row.status === TaskStatus.Completed"
          class="q-my-xs"
          name="check"
          color="green"
          size="md"
        />
        <q-btn v-else dense flat @click="finishEarly">
          <q-spinner-clock
            v-if="rows.row.status === TaskStatus.RunningWork"
            class="q-my-xs"
            color="red"
            size="md"
          />
          <q-spinner-clock
            v-else-if="rows.row.status === TaskStatus.RunningBreak"
            class="q-my-xs"
            color="purple"
            size="md"
          />
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useTasks } from '../stores/tasks';
import { Task, TaskStatus } from '../types';

const $q = useQuasar();

const tasksStore = useTasks();

const tasks = ref<Task[]>(tasksStore.getTasksSortedByStatus);

tasksStore.$subscribe(() => {
  tasks.value = [];
  tasks.value = tasksStore.getTasksSortedByStatus;
});

const columns = [
  {
    name: 'title',
    label: 'Task',
    field: 'name',
    align: 'left',
    sortable: false,
    style: 'width: 45%',

    classes: 'my-body',
    headerClasses: 'my-subtitle',
  },
  {
    name: 'duration',
    label: 'Duration',
    field: 'duration',
    align: 'center',
    sortable: false,
    format: (duration: number) => {
      const minutes = Math.floor(duration / 1000 / 60);
      const seconds = Math.round(duration / 1000 - minutes * 60);
      return seconds >= 1 ? `${minutes} min ${seconds} sec` : `${minutes} min`;
    },
    style: 'width: 35%',

    classes: 'my-body',
    headerClasses: 'my-subtitle',
  },
  {
    name: 'actions',
    label: '',
    field: 'actions',
    align: 'center',
    sortable: false,
    style: 'width: 20%',

    classes: 'my-body',
    headerClasses: 'my-subtitle',
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any[];

const pagination = ref({
  rowsPerPage: 0,
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
</style>
