<template>
  <q-table
    class="sticky-header-table q-my-auto"
    :columns="columns"
    :rows="tasks"
    row-key="id"
    hide-header
    hide-bottom
    virtual-scroll
    v-model:pagination="pagination"
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <div class="row justify-between items-center fit">
        <div class="my-title col-shrink">Tasks</div>
        <q-btn
          @click="emptyLocalStorage"
          class="q-my-xs col-shrink"
          color="negative"
          flat
          ripple
          icon="o_delete"
          size="md"
        />
      </div>
    </template>
    <template v-slot:body="rows">
      <q-separator v-if="rows.rowIndex > 0" />
      <q-item>
        <q-item-section>
          <q-item-label>{{ rows.row['name'] ?? '--' }}</q-item-label>
          <q-item-label caption>{{
            rows.row['duration']
              ? Duration.fromMillis(rows.row['duration']).toFormat(
                  "mm 'min' ss 'sec'",
                )
              : '--:--'
          }}</q-item-label>
        </q-item-section>

        <q-item-section avatar>
          <div class="q-pa-sm">
            <q-btn
              v-if="rows.row.status === TaskStatus.Pending"
              @click="startTimer(rows.row.id)"
              class="fit squared_icon extra_border"
              color="green"
              outline
              round
              icon="play_arrow"
              size="sm"
            />
            <q-icon
              v-else-if="rows.row.status === TaskStatus.Completed"
              class="fit squared_icon"
              name="check"
              color="green"
              size="md"
            />
            <q-btn
              class="fit squared_icon q-ma-none q-pa-none"
              v-else
              dense
              flat
              round
              @click="finishEarly"
            >
              <q-spinner-clock
                v-if="rows.row.status === TaskStatus.RunningWork"
                color="red"
                size="md"
              />
              <q-spinner-clock
                v-else-if="rows.row.status === TaskStatus.RunningBreak"
                color="purple"
                size="md"
              />
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Duration } from 'luxon';
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
