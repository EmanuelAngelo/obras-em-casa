<template>
  <v-card variant="tonal" rounded="lg">
    <v-card-title>{{ titulo }}</v-card-title>
    <v-card-text>
      <v-text-field
        label="Nome/modelo"
        :model-value="r.nome"
        @update:modelValue="(v) => set({ nome: v })"
        placeholder="Ex: Porcelanato 60x60"
      />

      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Largura peça (cm)"
            type="number"
            :model-value="r.dimensaoCm.largura"
            @update:modelValue="(v) => setDim('largura', Number(v))"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Comprimento peça (cm)"
            type="number"
            :model-value="r.dimensaoCm.comprimento"
            @update:modelValue="(v) => setDim('comprimento', Number(v))"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-text-field
            label="m² por caixa"
            type="number"
            :model-value="r.caixas.m2PorCaixa"
            @update:modelValue="(v) => setCaixa('m2PorCaixa', Number(v))"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Peças por caixa"
            type="number"
            :model-value="r.caixas.pecasPorCaixa"
            @update:modelValue="(v) => setCaixa('pecasPorCaixa', Number(v))"
          />
        </v-col>
      </v-row>

      <v-text-field
        label="Perda (%)"
        type="number"
        :model-value="r.perdaPercent"
        @update:modelValue="(v) => set({ perdaPercent: Number(v) })"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

const props = defineProps({
  tipo: { type: String, required: true }, // "piso" | "parede"
  titulo: { type: String, required: true },
});

const store = useAppStore();

const r = computed(() => store.revestimentos[props.tipo]);

function set(patch) {
  store.setRevestimento(props.tipo, patch);
}
function setDim(field, value) {
  set({ dimensaoCm: { ...r.value.dimensaoCm, [field]: value } });
}
function setCaixa(field, value) {
  set({ caixas: { ...r.value.caixas, [field]: value } });
}
</script>
