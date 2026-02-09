<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title">Meus Projetos</h2>
        <button class="btn btn-sm btn-outline" @click="$emit('close')">Fechar</button>
      </div>

      <div v-if="!store.projetos?.length" class="alert mt-3">
        <span>Nenhum projeto salvo ainda. Clique em <b>Concluir</b> no resumo para salvar.</span>
      </div>

      <div v-else class="mt-3 space-y-2">
        <div v-for="p in store.projetos" :key="p.id" class="flex items-center justify-between bg-base-200 rounded-box p-3">
          <div>
            <div class="font-semibold">{{ p.nome }}</div>
            <div class="text-xs opacity-70">{{ format(p.createdAt) }}</div>
          </div>

          <div class="flex gap-2">
            <button class="btn btn-sm btn-primary" @click="open(p.id)">Abrir</button>
            <button class="btn btn-sm btn-ghost" @click="store.deleteProjectById(p.id)">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const store = useAppStore();

const emit = defineEmits(["open", "close"]);

function open(id) {
  emit("open", id);
}

function format(iso) {
  try { return new Date(iso).toLocaleString("pt-BR"); }
  catch { return iso; }
}
</script>
