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
          Cadastre seus cômodos com <b>largura</b> e <b>comprimento</b>. Para paredes,
          marque a altura do revestimento. Em banheiro, ative o <b>box</b>. Use descontos
          para <b>portas/janelas</b>.
        </span>
      </div>

      <div class="mt-4 space-y-4">
        <div v-for="a in store.ambientes" :key="a.id" class="card bg-base-200">
          <div class="card-body gap-4">

            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-semibold">{{ a.nome || "Novo ambiente" }}</div>
                <div class="text-xs opacity-70">
                  Piso: <b>{{ areaPiso(a).toFixed(2) }} m²</b>
                  <span v-if="a.parede?.aplicar">
                    • Parede: <b>{{ areaParede(a).toFixed(2) }} m²</b>
                  </span>
                  <span v-if="a.box?.aplicar">
                    • Box: <b>{{ areaBox(a).toFixed(2) }} m²</b>
                  </span>
                </div>
              </div>

              <button class="btn btn-ghost btn-sm" @click="store.removeAmbiente(a.id)">
                ✕
              </button>
            </div>

            <!-- Dimensões -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label class="form-control">
                <div class="label"><span class="label-text">Nome</span></div>
                <input class="input input-bordered" placeholder="Ex: Banheiro"
                  :value="a.nome"
                  @input="onNomeChange(a.id, $event.target.value)" />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">Largura (m)</span></div>
                <input type="number" class="input input-bordered"
                  :value="a.dimensoes?.larguraM ?? 0"
                  @input="patchDim(a.id, 'larguraM', Number($event.target.value))" />
              </label>

              <label class="form-control">
                <div class="label"><span class="label-text">Comprimento (m)</span></div>
                <input type="number" class="input input-bordered"
                  :value="a.dimensoes?.comprimentoM ?? 0"
                  @input="patchDim(a.id, 'comprimentoM', Number($event.target.value))" />
              </label>

              <div class="alert bg-base-100">
                <span class="text-sm">
                  Piso = largura × comprimento
                </span>
              </div>
            </div>

            <!-- Parede -->
            <div class="divider my-1">Paredes</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label class="form-control">
                <div class="label"><span class="label-text">Revestir paredes?</span></div>
                <div class="flex items-center gap-3 h-12">
                  <input type="checkbox" class="toggle toggle-primary"
                    :checked="Boolean(a.parede?.aplicar)"
                    @change="patchParede(a.id, { aplicar: $event.target.checked })" />
                  <span class="text-sm opacity-70">Ativar</span>
                </div>
              </label>

              <label class="form-control" v-if="a.parede?.aplicar">
                <div class="label"><span class="label-text">Altura (m)</span></div>
                <input type="number" class="input input-bordered" placeholder="Ex: 1.20 / 2.60"
                  :value="a.parede?.alturaM ?? 0"
                  @input="patchParede(a.id, { alturaM: Number($event.target.value) })" />
              </label>

              <div class="alert alert-info" v-if="a.parede?.aplicar">
                <span class="text-sm">
                  Parede = perímetro × altura – descontos
                </span>
              </div>
            </div>

            <!-- Descontos parede -->
            <div v-if="a.parede?.aplicar" class="mt-2">
              <div class="flex items-center justify-between">
                <div class="font-semibold text-sm">Descontos (porta/janela)</div>
                <button class="btn btn-sm" @click="store.addDesconto(a.id, 'parede', { tipo:'porta', larguraM:0.80, alturaM:2.10, qtd:1 })">
                  + Add
                </button>
              </div>

              <div class="overflow-x-auto mt-2">
                <table class="table table-zebra table-sm bg-base-100 rounded-box">
                  <thead>
                    <tr>
                      <th>Tipo</th><th>Largura</th><th>Altura</th><th>Qtd</th><th>Área</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="d in (a.parede?.descontos || [])" :key="d.id">
                      <td>
                        <select class="select select-bordered select-sm"
                          :value="d.tipo"
                          @change="patchDesconto(a.id, 'parede', d.id, { tipo: $event.target.value })">
                          <option value="porta">porta</option>
                          <option value="janela">janela</option>
                          <option value="outro">outro</option>
                        </select>
                      </td>
                      <td><input class="input input-bordered input-sm w-24" type="number"
                        :value="d.larguraM"
                        @input="patchDesconto(a.id, 'parede', d.id, { larguraM: Number($event.target.value) })" /></td>
                      <td><input class="input input-bordered input-sm w-24" type="number"
                        :value="d.alturaM"
                        @input="patchDesconto(a.id, 'parede', d.id, { alturaM: Number($event.target.value) })" /></td>
                      <td><input class="input input-bordered input-sm w-20" type="number"
                        :value="d.qtd"
                        @input="patchDesconto(a.id, 'parede', d.id, { qtd: Number($event.target.value) })" /></td>
                      <td class="text-sm">
                        {{ (Number(d.larguraM||0) * Number(d.alturaM||0) * Number(d.qtd||1)).toFixed(2) }} m²
                      </td>
                      <td>
                        <button class="btn btn-ghost btn-sm" @click="store.removeDesconto(a.id, 'parede', d.id)">✕</button>
                      </td>
                    </tr>

                    <tr v-if="!(a.parede?.descontos || []).length">
                      <td colspan="6" class="text-sm opacity-70">Sem descontos.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Box -->
             <div v-if="isBanheiro(a)">
            <div class="divider my-1">Box do banheiro</div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label class="form-control">
                <div class="label"><span class="label-text">Tem box?</span></div>
                <div class="flex items-center gap-3 h-12">
                  <input type="checkbox" class="toggle toggle-secondary"
                    :checked="Boolean(a.box?.aplicar)"
                    @change="patchBox(a.id, { aplicar: $event.target.checked })" />
                  <span class="text-sm opacity-70">Ativar</span>
                </div>
              </label>

              <label class="form-control" v-if="a.box?.aplicar">
                <div class="label"><span class="label-text">Largura do box (m)</span></div>
                <input type="number" class="input input-bordered"
                  :value="a.box?.larguraM ?? 0"
                  @input="patchBox(a.id, { larguraM: Number($event.target.value) })" />
              </label>

              <label class="form-control" v-if="a.box?.aplicar">
                <div class="label"><span class="label-text">Comprimento do box (m)</span></div>
                <input type="number" class="input input-bordered"
                  :value="a.box?.comprimentoM ?? 0"
                  @input="patchBox(a.id, { comprimentoM: Number($event.target.value) })" />
              </label>

              <label class="form-control" v-if="a.box?.aplicar">
                <div class="label"><span class="label-text">Altura do box (m)</span></div>
                <input type="number" class="input input-bordered" placeholder="Ex: 2.10 / 2.30"
                  :value="a.box?.alturaM ?? 0"
                  @input="patchBox(a.id, { alturaM: Number($event.target.value) })" />
              </label>
            </div>

            <div v-if="a.box?.aplicar" class="alert alert-info">
              <span class="text-sm">
                Box (3 paredes) = (2×largura + comprimento) × altura – descontos
              </span>
            </div>

            <!-- Descontos box -->
            <div v-if="a.box?.aplicar" class="mt-2">
              <div class="flex items-center justify-between">
                <div class="font-semibold text-sm">Descontos do box</div>
                <button class="btn btn-sm" @click="store.addDesconto(a.id, 'box', { tipo:'janela', larguraM:0.50, alturaM:0.50, qtd:1 })">
                  + Add
                </button>
              </div>
              </div>
              <div class="overflow-x-auto mt-2">
                <table class="table table-zebra table-sm bg-base-100 rounded-box">
                  <thead>
                    <tr>
                      <th>Tipo</th><th>Largura</th><th>Altura</th><th>Qtd</th><th>Área</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="d in (a.box?.descontos || [])" :key="d.id">
                      <td>
                        <select class="select select-bordered select-sm"
                          :value="d.tipo"
                          @change="patchDesconto(a.id, 'box', d.id, { tipo: $event.target.value })">
                          <option value="porta">porta</option>
                          <option value="janela">janela</option>
                          <option value="outro">outro</option>
                        </select>
                      </td>
                      <td><input class="input input-bordered input-sm w-24" type="number"
                        :value="d.larguraM"
                        @input="patchDesconto(a.id, 'box', d.id, { larguraM: Number($event.target.value) })" /></td>
                      <td><input class="input input-bordered input-sm w-24" type="number"
                        :value="d.alturaM"
                        @input="patchDesconto(a.id, 'box', d.id, { alturaM: Number($event.target.value) })" /></td>
                      <td><input class="input input-bordered input-sm w-20" type="number"
                        :value="d.qtd"
                        @input="patchDesconto(a.id, 'box', d.id, { qtd: Number($event.target.value) })" /></td>
                      <td class="text-sm">
                        {{ (Number(d.larguraM||0) * Number(d.alturaM||0) * Number(d.qtd||1)).toFixed(2) }} m²
                      </td>
                      <td>
                        <button class="btn btn-ghost btn-sm" @click="store.removeDesconto(a.id, 'box', d.id)">✕</button>
                      </td>
                    </tr>

                    <tr v-if="!(a.box?.descontos || []).length">
                      <td colspan="6" class="text-sm opacity-70">Sem descontos.</td>
                    </tr>
                  </tbody>
                </table>
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

function onNomeChange(id, nome) {
  const a = store.ambientes.find(x => x.id === id);
  const nextNome = nome;

  const eraBanheiro = isBanheiro(a);
  const seraBanheiro = normalizeText(nextNome).includes("banheiro");

  // Se deixou de ser banheiro, desliga box para não somar escondido
  if (eraBanheiro && !seraBanheiro) {
    store.updateAmbiente(id, {
      nome: nextNome,
      box: { ...(a?.box || {}), aplicar: false },
    });
    return;
  }

  store.updateAmbiente(id, { nome: nextNome });
}

function patchDim(id, field, value) {
  const a = store.ambientes.find((x) => x.id === id);
  store.updateAmbiente(id, { dimensoes: { ...(a?.dimensoes || {}), [field]: value } });
}

function patchParede(id, patch) {
  const a = store.ambientes.find((x) => x.id === id);
  store.updateAmbiente(id, {
    parede: { ...(a?.parede || { aplicar: false, alturaM: 0, descontos: [] }), ...patch },
  });
}

function patchBox(id, patch) {
  const a = store.ambientes.find((x) => x.id === id);
  store.updateAmbiente(id, {
    box: { ...(a?.box || { aplicar: false, larguraM: 0, comprimentoM: 0, alturaM: 0, descontos: [] }), ...patch },
  });
}

function patchDesconto(ambienteId, alvo, descontoId, patch) {
  const a = store.ambientes.find((x) => x.id === ambienteId);
  if (!a) return;

  const key = alvo === "box" ? "box" : "parede";
  const descontos = (a[key]?.descontos || []).map(d => d.id === descontoId ? { ...d, ...patch } : d);

  store.updateAmbiente(ambienteId, {
    [key]: { ...a[key], descontos },
  });
}

function descontosArea(descontos = []) {
  return (descontos || []).reduce((s, d) => s + (Number(d.larguraM)||0)*(Number(d.alturaM)||0)*(Number(d.qtd)||1), 0);
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
  const per = 2 * (w + l);
  const area = per * h - descontosArea(a.parede?.descontos);
  return Math.max(0, area);
}

function areaBox(a) {
  if (!a.box?.aplicar) return 0;
  const bw = Number(a.box?.larguraM) || 0;
  const bl = Number(a.box?.comprimentoM) || 0;
  const bh = Number(a.box?.alturaM) || 0;
  const per3 = 2 * bw + bl;
  const area = per3 * bh - descontosArea(a.box?.descontos);
  return Math.max(0, area);
}

function normalizeText(s = "") {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .trim();
}

function isBanheiro(a) {
  return normalizeText(a?.nome).includes("banheiro");
}

</script>
