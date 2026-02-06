<template>
  <v-card rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Ambientes</span>
      <v-btn @click="store.addAmbiente()">+ Adicionar</v-btn>
    </v-card-title>

    <v-card-text>
      <v-alert v-if="!store.ambientes.length" type="info" variant="tonal">
        Adicione os ambientes e informe <b>largura</b> e <b>comprimento</b> (em metros).
        O app calcula automaticamente os m² do piso e, se ativar parede, calcula os m² da parede por perímetro.
      </v-alert>

      <v-row v-for="a in store.ambientes" :key="a.id" class="mb-4">
        <v-col cols="12">
          <v-card variant="tonal" rounded="lg">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>{{ a.nome || "Novo ambiente" }}</span>
              <v-btn icon="mdi-delete" variant="text" @click="store.removeAmbiente(a.id)" />
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Nome"
                    :model-value="a.nome"
                    @update:modelValue="(v) => store.updateAmbiente(a.id, { nome: v })"
                    placeholder="Ex: Sala"
                  />
                </v-col>

                <v-col cols="6" md="4">
                  <v-text-field
                    label="Largura (m)"
                    type="number"
                    :model-value="a.dimensoes?.larguraM ?? 0"
                    @update:modelValue="(v) => patchDim(a.id, 'larguraM', Number(v))"
                  />
                </v-col>

                <v-col cols="6" md="4">
                  <v-text-field
                    label="Comprimento (m)"
                    type="number"
                    :model-value="a.dimensoes?.comprimentoM ?? 0"
                    @update:modelValue="(v) => patchDim(a.id, 'comprimentoM', Number(v))"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-switch
                    inset
                    label="Revestir paredes neste ambiente?"
                    :model-value="Boolean(a.parede?.aplicar)"
                    @update:modelValue="(v) => patchParede(a.id, { aplicar: Boolean(v) })"
                  />
                </v-col>

                <v-col cols="12" md="4" v-if="a.parede?.aplicar">
                  <v-text-field
                    label="Altura do revestimento (m)"
                    type="number"
                    :model-value="a.parede?.alturaM ?? 0"
                    @update:modelValue="(v) => patchParede(a.id, { alturaM: Number(v) })"
                    placeholder="Ex: 1.20 (cozinha) / 2.60 (até o teto)"
                  />
                </v-col>

                <v-col cols="12" md="4" class="d-flex flex-column justify-center">
                  <div class="text-caption text-medium-emphasis">Cálculo automático</div>
                  <div class="text-body-2">
                    Piso: <b>{{ areaPiso(a).toFixed(2) }} m²</b>
                    <span v-if="a.parede?.aplicar">
                      | Parede: <b>{{ areaParede(a).toFixed(2) }} m²</b>
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
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
  const aplicar = Boolean(a.parede?.aplicar);
  if (!aplicar) return 0;

  const w = Number(a.dimensoes?.larguraM) || 0;
  const l = Number(a.dimensoes?.comprimentoM) || 0;
  const h = Number(a.parede?.alturaM) || 0;

  const perimetro = 2 * (w + l);
  return perimetro * h;
}
</script>
