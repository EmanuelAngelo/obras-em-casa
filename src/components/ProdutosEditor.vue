<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title">Produtos / Revestimentos</h2>
        <button class="btn btn-primary" @click="store.addProduto()">+ Produto</button>
      </div>

      <div v-if="!store.produtos?.length" class="alert mt-4">
        <span>
          Adicione um produto (ex.: “Piso 46x46 Cerbras…”) e preencha <b>m²/caixa</b> e <b>R$/m²</b>.
          Depois marque em quais ambientes ele será usado.
        </span>
      </div>

      <div class="mt-4 space-y-4">
        <div v-for="p in store.produtos" :key="p.id" class="card bg-base-200">
          <div class="card-body gap-4">

            <div class="flex items-start justify-between gap-3">
              <div class="w-full">
                <div class="text-sm font-semibold mb-1">Descrição do produto</div>
                <input
                  class="input input-bordered w-full"
                  placeholder="Ex: Piso 46x46 Tipo A Ipanema Bege Cerbras"
                  :value="p.nome"
                  @input="store.updateProduto(p.id, { nome: $event.target.value })"
                />
              </div>

              <button class="btn btn-ghost btn-sm mt-6" @click="store.removeProduto(p.id)">✕</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label class="form-control">
                <div class="label"><span class="label-text">Aplicação</span></div>
                <select
                  class="select select-bordered"
                  :value="p.aplicaEm"
                  @change="store.updateProduto(p.id, { aplicaEm: $event.target.value })"
                >
                  <option value="piso">Piso</option>
                  <option value="parede">Parede</option>
                  <option value="box">Box</option>
                </select>
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">m² por caixa</span></div>
                <input
                  class="input input-bordered"
                  type="number"
                  step="0.01"
                  :value="p.caixas?.m2PorCaixa ?? 0"
                  @input="store.updateProduto(p.id, { caixas: { m2PorCaixa: Number($event.target.value) } })"
                />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">Preço por m² (R$)</span></div>
                <input
                  class="input input-bordered"
                  type="number"
                  step="0.01"
                  :value="p.preco?.porM2 ?? 0"
                  @input="store.updateProduto(p.id, { preco: { porM2: Number($event.target.value) } })"
                />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">Perda (%)</span></div>
                <input
                  class="input input-bordered"
                  type="number"
                  step="1"
                  :value="p.perdaPercent ?? 10"
                  @input="store.updateProduto(p.id, { perdaPercent: Number($event.target.value) })"
                />
              </label>
            </div>

            <!-- Etiqueta (auto) -->
            <div class="alert alert-info">
              <span>
                <b>Preço por caixa (auto):</b>
                R$ {{ precoPorCaixa(p).toFixed(2) }}
                <span class="opacity-70">
                  (m²/caixa × R$/m²)
                </span>
              </span>
            </div>

            <!-- Vincular ambientes -->
            <div>
              <div class="font-semibold text-sm mb-2">
                Aplicar nos ambientes
                <span class="text-xs opacity-60">(marque onde esse produto será usado)</span>
              </div>

              <div v-if="!store.ambientes?.length" class="text-sm opacity-70">
                Cadastre ambientes primeiro.
              </div>

              <div v-else class="flex flex-wrap gap-2">
                <label
                  v-for="a in store.ambientes"
                  :key="a.id"
                  class="label cursor-pointer gap-2 bg-base-100 rounded-box px-3 py-2"
                >
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :checked="(p.ambientes || []).includes(a.id)"
                    @change="store.toggleProdutoAmbiente(p.id, a.id)"
                  />
                  <span class="label-text">{{ a.nome || "Sem nome" }}</span>
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
const store = useAppStore();

function precoPorCaixa(p) {
  const m2 = Number(p.caixas?.m2PorCaixa) || 0;
  const pm2 = Number(p.preco?.porM2) || 0;
  return m2 * pm2;
}
</script>
