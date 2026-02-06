<template>
  <v-card rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Ambientes</span>
      <v-btn @click="store.addAmbiente({ nome: '', tipo: 'chao', area: 0 })">
        + Adicionar
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-alert v-if="!store.ambientes.length" type="info" variant="tonal">
        Adicione ambientes (Sala, Cozinha, Quartos...) e informe a área em m².
      </v-alert>

      <v-row v-for="a in store.ambientes" :key="a.id" class="mb-2">
        <v-col cols="12" md="5">
          <v-text-field
            label="Nome"
            :model-value="a.nome"
            @update:modelValue="(v) => store.updateAmbiente(a.id, { nome: v })"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            label="Tipo"
            :items="tipos"
            item-title="label"
            item-value="value"
            :model-value="a.tipo"
            @update:modelValue="(v) => store.updateAmbiente(a.id, { tipo: v })"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            label="Área (m²)"
            type="number"
            :model-value="a.area"
            @update:modelValue="(v) => store.updateAmbiente(a.id, { area: Number(v) })"
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn icon="mdi-delete" variant="text" @click="store.removeAmbiente(a.id)" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();

const tipos = [
  { label: "Chão", value: "chao" },
  { label: "Parede", value: "parede" },
];
</script>
