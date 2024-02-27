<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" seamless persistent>
    <TaskForm @added="onDialogOK" />
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import TaskForm from '../components/TaskForm.vue';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
</script>
