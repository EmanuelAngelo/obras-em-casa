<template>
  <v-card rounded="lg">
    <v-card-title>Projeto</v-card-title>
    <v-card-text>
      <v-text-field
        label="Nome do projeto"
        v-model="nome"
        @update:modelValue="store.setProjetoNome(nome)"
        placeholder="Ex: Casa da Rosania"
        clearable
      />
      <v-btn variant="tonal" @click="store.resetAll()">Zerar tudo</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const nome = computed({
  get: () => store.projeto.nome,
  set: (v) => store.setProjetoNome(v),
});
</script>
