<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">Projeto</h2>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Nome do projeto</span>
        </div>
        <input
          class="input input-bordered w-full"
          placeholder="Ex: Minha casa 2026"
          :value="store.projeto.nome"
          @input="store.setProjetoNome($event.target.value)"
        />
      </label>

      <div class="text-xs opacity-70 mt-2">
        Salvo automaticamente em cookies (30 dias).
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const store = useAppStore();
</script>
