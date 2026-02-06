<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">Resumo</h2>

      <div class="stats stats-vertical md:stats-horizontal shadow bg-base-200">
        <div class="stat">
          <div class="stat-title">Área chão</div>
          <div class="stat-value text-2xl">{{ store.totalAreaChao.toFixed(2) }}</div>
          <div class="stat-desc">m²</div>
        </div>
        <div class="stat">
          <div class="stat-title">Área parede</div>
          <div class="stat-value text-2xl">{{ store.totalAreaParede.toFixed(2) }}</div>
          <div class="stat-desc">m²</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="space-y-3">
        <div class="alert alert-info">
          <span><b>Piso:</b> {{ calc("piso", store.totalAreaChao) }}</span>
        </div>
        <div class="alert alert-info">
          <span><b>Parede:</b> {{ calc("parede", store.totalAreaParede) }}</span>
        </div>
      </div>
    </div>
  </div>
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

  const parte = `QUANTIDADE (m²): ${areaNecessaria.toFixed(2)} | Você vai precisar de ${caixas} caixa(s).`;

  if (!precoPorM2) return `${parte} (Informe preço por m² para estimar custo.)`;

  return `${parte} Valor por caixa: R$ ${precoPorCaixa.toFixed(2)} | Total: R$ ${total.toFixed(2)} | m² comprado: ${m2Comprado.toFixed(2)}.`;
}
</script>
