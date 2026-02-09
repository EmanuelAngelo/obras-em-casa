<template>
  <div class="p-6 bg-white text-black" style="width: 794px;">
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="text-2xl font-bold">Obras em Casa — Checklist de Compra</div>
        <div class="text-sm opacity-70">
          Projeto: <b>{{ store.projeto?.nome || "Sem nome" }}</b>
          • Gerado em: {{ now }}
        </div>
      </div>
      <div class="text-right text-sm">
        <div class="font-semibold">Resumo</div>
        <div>Área piso: <b>{{ store.totalAreaChao.toFixed(2) }} m²</b></div>
        <div>Área parede+box: <b>{{ store.totalAreaParede.toFixed(2) }} m²</b></div>
      </div>
    </div>

    <div class="mt-6">
      <div class="text-lg font-bold mb-2">Produtos</div>

      <table class="w-full text-sm border border-black/20">
        <thead class="bg-black/5">
          <tr>
            <th class="text-left p-2 border-b border-black/20">Produto</th>
            <th class="text-left p-2 border-b border-black/20">Aplicação</th>
            <th class="text-right p-2 border-b border-black/20">m² necessário</th>
            <th class="text-right p-2 border-b border-black/20">m²/caixa</th>
            <th class="text-right p-2 border-b border-black/20">Caixas</th>
            <th class="text-right p-2 border-b border-black/20">R$/caixa</th>
            <th class="text-right p-2 border-b border-black/20">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in store.resumoPorProduto" :key="p.id">
            <td class="p-2 border-b border-black/10">
              <b>{{ p.nome || "Produto" }}</b>
            </td>
            <td class="p-2 border-b border-black/10">{{ labelAplica(p.aplicaEm) }}</td>
            <td class="p-2 border-b border-black/10 text-right">{{ p.areaNecessaria.toFixed(2) }}</td>
            <td class="p-2 border-b border-black/10 text-right">{{ (p.caixas?.m2PorCaixa ?? 0).toFixed(2) }}</td>
            <td class="p-2 border-b border-black/10 text-right"><b>{{ p.caixas }}</b></td>
            <td class="p-2 border-b border-black/10 text-right">
              {{ p.precoPorCaixa ? p.precoPorCaixa.toFixed(2) : "—" }}
            </td>
            <td class="p-2 border-b border-black/10 text-right">
              <b>{{ p.total ? p.total.toFixed(2) : "—" }}</b>
            </td>
          </tr>

          <tr v-if="!store.resumoPorProduto.length">
            <td class="p-2" colspan="7">Nenhum produto cadastrado.</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 text-sm">
        <div class="font-semibold">Observações</div>
        <ul class="list-disc pl-5">
          <li>Comprar caixas inteiras (arredondamento para cima).</li>
          <li>Preferir mesmo lote/calibre para evitar variação de tonalidade.</li>
          <li>Perda aplicada conforme configurada em cada produto.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const store = useAppStore();
const now = new Date().toLocaleString();

function labelAplica(v) {
  if (v === "piso") return "Piso";
  if (v === "parede") return "Parede";
  if (v === "box") return "Box";
  return v;
}
</script>
