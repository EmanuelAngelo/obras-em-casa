<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">Resumo de Compra</h2>

      <div class="mt-3 space-y-3">
        <div v-for="p in store.resumoPorProduto" :key="p.id" class="alert alert-info">
          <span>
            <b>{{ p.nome || 'Produto' }}</b><br/>
            Área necessária: {{ p.areaNecessaria.toFixed(2) }} m² |
            Comprar: <b>{{ p.caixas }} caixa(s)</b><br/>
            Valor por caixa: R$ {{ p.precoPorCaixa.toFixed(2) }} |
            <b>Total: R$ {{ p.total.toFixed(2) }}</b>
          </span>
        </div>

        <div v-if="!store.resumoPorProduto.length" class="alert">
          <span>Nenhum produto cadastrado.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const store = useAppStore();
</script>
