<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <div class="flex items-center justify-between gap-3">
        <h2 class="card-title">Ambientes</h2>
        <button class="btn btn-primary" @click="store.addAmbiente()">
          + Adicionar
        </button>
      </div>

      <div v-if="!store.ambientes.length" class="alert mt-4">
        <span>
          Adicione ambientes e informe <b>largura</b> e <b>comprimento</b> (m).
          O app calcula automaticamente o piso e, se ativar parede, calcula por
          <b>perímetro × altura</b>.
        </span>
      </div>

      <div class="mt-4 space-y-4">
        <div
          v-for="a in store.ambientes"
          :key="a.id"
          class="card bg-base-200"
        >
          <div class="card-body gap-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-semibold">
                  {{ a.nome || "Novo ambiente" }}
                </div>
                <div class="text-xs opacity-70">
                  Piso: <b>{{ areaPiso(a).toFixed(2) }} m²</b>
                  <span v-if="a.parede?.aplicar">
                    • Parede: <b>{{ areaParede(a).toFixed(2) }} m²</b>
                  </span>
                </div>
              </div>
              <button class="btn btn-ghost btn-sm" @click="store.removeAmbiente(a.id)">
                ✕
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label class="form-control">
                <div class="label"><span class="label-text">Nome</span></div>
                <input
                  class="input input-bordered"
                  placeholder="Ex: Sala"
                  :value="a.nome"
                  @input="store.updateAmbiente(a.id, { nome: $event.target.value })"
                />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">Largura (m)</span></div>
                <input
                  type="number"
                  class="input input-bordered"
                  :value="a.dimensoes?.larguraM ?? 0"
                  @input="patchDim(a.id, 'larguraM', Number($event.target.value))"
                />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">Comprimento (m)</span></div>
                <input
                  type="number"
                  class="input input-bordered"
                  :value="a.dimensoes?.comprimentoM ?? 0"
                  @input="patchDim(a.id, 'comprimentoM', Number($event.target.value))"
                />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">Revestir paredes?</span></div>
                <div class="flex items-center gap-3 h-12">
                  <input
                    type="checkbox"
                    class="toggle toggle-primary"
                    :checked="Boolean(a.parede?.aplicar)"
                    @change="patchParede(a.id, { aplicar: $event.target.checked })"
                  />
                  <span class="text-sm opacity-70">Ativar</span>
                </div>
              </label>
            </div>

            <div v-if="a.parede?.aplicar" class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label class="form-control">
                <div class="label">
                  <span class="label-text">Altura do revestimento (m)</span>
                </div>
                <input
                  type="number"
                  class="input input-bordered"
                  placeholder="Ex: 1.20 / 2.60"
                  :value="a.parede?.alturaM ?? 0"
                  @input="patchParede(a.id, { alturaM: Number($event.target.value) })"
                />
              </label>

              <div class="alert alert-info md:col-span-2">
                <span>
                  Parede = perímetro × altura.
                  (Depois adicionamos descontos de porta/janela e box.)
                </span>
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

function patchDim(id, field, value) {
  const a = store.ambientes.find((x) => x.id === id);
  store.updateAmbiente(id, {
    dimensoes: { ...(a?.dimensoes || {}), [field]: value },
  });
}

function patchParede(id, patch) {
  const a = store.ambientes.find((x) => x.id === id);
  store.updateAmbiente(id, {
    parede: { ...(a?.parede || { aplicar: false, alturaM: 0 }), ...patch },
  });
}

function areaPiso(a) {
  const w = Number(a.dimensoes?.larguraM) || 0;
  const l = Number(a.dimensoes?.comprimentoM) || 0;
  return w * l;
}

function areaParede(a) {
  if (!a.parede?.aplicar) return 0;
  const w = Number(a.dimensoes?.larguraM) || 0;
  const l = Number(a.dimensoes?.comprimentoM) || 0;
  const h = Number(a.parede?.alturaM) || 0;
  const perimetro = 2 * (w + l);
  return perimetro * h;
}
</script>
