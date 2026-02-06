<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">{{ titulo }}</h2>

      <label class="form-control">
        <div class="label"><span class="label-text">Descrição</span></div>
        <input
          class="input input-bordered"
          placeholder="Ex: Piso 46x46 Tipo A Ipanema Bege Cerbras"
          :value="r.nome"
          @input="set({ nome: $event.target.value })"
        />
      </label>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label class="form-control">
          <div class="label"><span class="label-text">m² por caixa</span></div>
          <input
            type="number"
            class="input input-bordered"
            :value="r.caixas.m2PorCaixa"
            @input="setCaixa('m2PorCaixa', Number($event.target.value))"
          />
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">Preço por m² (R$)</span></div>
          <input
            type="number"
            class="input input-bordered"
            :value="r.preco?.porM2 ?? 0"
            @input="set({ preco: { ...(r.preco || {}), porM2: Number($event.target.value) } })"
          />
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">Perda (%)</span></div>
          <input
            type="number"
            class="input input-bordered"
            :value="r.perdaPercent"
            @input="set({ perdaPercent: Number($event.target.value) })"
          />
        </label>

        <div class="alert alert-info">
          <span>
            Preço por caixa (auto): <b>R$ {{ precoPorCaixa ? precoPorCaixa.toFixed(2) : "—" }}</b>
          </span>
        </div>
      </div>

      <div class="text-xs opacity-70">
        Dica: essa tela segue a lógica da etiqueta da loja (m²/caixa + preço/m² → preço/caixa).
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

const props = defineProps({
  tipo: { type: String, required: true },
  titulo: { type: String, required: true },
});

const store = useAppStore();
const r = computed(() => store.revestimentos[props.tipo]);

const precoPorCaixa = computed(() => {
  const m2 = Number(r.value.caixas.m2PorCaixa) || 0;
  const p = Number(r.value.preco?.porM2) || 0;
  if (!m2 || !p) return 0;
  return m2 * p;
});

function set(patch) {
  store.setRevestimento(props.tipo, patch);
}
function setCaixa(field, value) {
  set({ caixas: { ...r.value.caixas, [field]: value } });
}
</script>
