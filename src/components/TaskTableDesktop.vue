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
        <div class="squared_icon_container">
          <div class="squared_icon">
            <q-btn
              v-if="rows.row.status === TaskStatus.Pending"
              @click="startTimer(rows.row.id)"
              class="fit q-pa-none q-ma-none extra_border"
              color="green"
              outline
              round
              icon="play_arrow"
              size="11px"
            />
            <q-icon
              v-else-if="rows.row.status === TaskStatus.Completed"
              class="fit"
              name="check"
              color="green"
              size="33px"
            />
            <q-btn
              class="fit q-pa-none q-ma-none"
              round
              v-else
              dense
              flat
              @click="finishEarly"
            >
              <q-spinner-clock
                v-if="rows.row.status === TaskStatus.RunningWork"
                color="red"
                size="33px"
              />
              <q-spinner-clock
                v-else-if="rows.row.status === TaskStatus.RunningBreak"
                color="purple"
                size="33px"
              />
            </q-btn>
          </div>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Task, TaskStatus } from '../types';

defineProps<{
  tasks: Task[];
}>();

const emit = defineEmits<{
  start: [id: number];
  finish: [];
  empty: [];
}>();

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
  emit('start', taskId);
};

const finishEarly = () => {
  emit('finish');
};

const emptyLocalStorage = () => {
  emit('empty');
};
</script>
