<template>
  <button class="btn btn-outline" @click="onExport" :disabled="loading">
    <span v-if="!loading">Exportar PDF</span>
    <span v-else>Gerando…</span>
  </button>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/app";
import { exportChecklistPdf } from "@/services/exportChecklistPdf";

const store = useAppStore();
const loading = ref(false);

async function onExport() {
  loading.value = true;
  try {
    exportChecklistPdf(store);
  } finally {
    loading.value = false;
  }
}
</script>
