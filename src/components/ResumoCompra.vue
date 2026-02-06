<template>
  <v-card rounded="lg">
    <v-card-title>Resumo</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">Área chão</div>
          <div class="text-h6">{{ store.totalAreaChao.toFixed(2) }} m²</div>
        </v-col>
        <v-col cols="6">
          <div class="text-caption text-medium-emphasis">Área parede</div>
          <div class="text-h6">{{ store.totalAreaParede.toFixed(2) }} m²</div>
        </v-col>
      </v-row>

      <v-divider class="my-3" />

      <div class="text-subtitle-2 mb-2">Estimativa por caixa (se m²/caixa informado)</div>

      <v-row>
        <v-col cols="12" md="6">
          <v-alert variant="tonal" type="info">
            Piso: {{ calc("piso", store.totalAreaChao) }}
          </v-alert>
        </v-col>
        <v-col cols="12" md="6">
          <v-alert variant="tonal" type="info">
            Parede: {{ calc("parede", store.totalAreaParede) }}
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();

function calc(tipo, areaBase) {
  const r = store.revestimentos[tipo];

  const perda = (Number(r.perdaPercent) || 0) / 100;
  const areaNecessaria = areaBase * (1 + perda);

  const m2PorCaixa = Number(r.caixas.m2PorCaixa) || 0;
  if (!m2PorCaixa) return "Informe m² por caixa para calcular caixas.";

  const caixas = Math.ceil(areaNecessaria / m2PorCaixa);
  const m2Comprado = caixas * m2PorCaixa;

  const precoPorM2 = Number(r.preco?.porM2) || 0;
  const precoPorCaixa = precoPorM2 ? m2PorCaixa * precoPorM2 : 0;
  const total = precoPorCaixa ? caixas * precoPorCaixa : 0;

  const parteCaixas = `Você vai precisar de ${caixas} caixa(s).`;
  const parteM2 = `Necessário: ${areaNecessaria.toFixed(2)} m² | Comprado: ${m2Comprado.toFixed(2)} m².`;

  if (!precoPorM2) return `${parteCaixas} ${parteM2} Informe preço por m² para estimar custo.`;

  return `${parteCaixas} ${parteM2} Valor por caixa: R$ ${precoPorCaixa.toFixed(2)} | Total: R$ ${total.toFixed(2)}.`;
}

</script>
