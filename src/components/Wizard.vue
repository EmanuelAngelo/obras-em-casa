<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
    <!-- Navbar -->
    <div class="navbar bg-base-100 rounded-box shadow">
      <div class="flex-1">
        <div class="text-xl font-bold">Obras em Casa</div>
        <div class="text-sm opacity-70 ml-3 hidden sm:block">
          Planejador de compra de pisos
        </div>
      </div>

      <div class="flex-none gap-2">
        <button class="btn btn-outline" @click="showProjetos = true">
          Meus projetos
        </button>
        <button class="btn btn-outline" @click="resetWizard">
          Zerar tudo
        </button>
      </div>
    </div>

    <!-- Steps -->
    <ul class="steps steps-vertical lg:steps-horizontal w-full bg-base-100 rounded-box shadow p-4">
      <li class="step" :class="step >= 1 ? 'step-primary' : ''">Ambientes</li>
      <li class="step" :class="step >= 2 ? 'step-primary' : ''">Paredes/Box</li>
      <li class="step" :class="step >= 3 ? 'step-primary' : ''">Produtos</li>
      <li class="step" :class="step >= 4 ? 'step-primary' : ''">Resumo</li>
    </ul>

    <!-- Conteúdo -->
    <div class="space-y-6">
      <template v-if="step === 1">
        <ProjetoForm />
        <AmbientesEditor />
      </template>

      <template v-else-if="step === 2">
        <div class="alert alert-info">
          <span>Agora ajuste paredes, box e descontos em cada ambiente.</span>
        </div>
        <AmbientesEditor />
      </template>

      <template v-else-if="step === 3">
        <div class="alert alert-info">
          <span>Cadastre os produtos conforme a etiqueta e vincule aos ambientes.</span>
        </div>
        <ProdutosEditor />
      </template>

      <template v-else>
        <div class="flex items-center justify-between gap-3">
          <div class="text-lg font-bold">Resumo final</div>
          <div class="flex gap-2">
            <ExportarPdfButton />
            <button class="btn btn-primary" @click="saveProject">
              Salvar projeto
            </button>
          </div>
        </div>

        <ResumoPorProduto />
        <Projeto3D />
      </template>
    </div>

    <!-- Navegação -->
    <div class="flex justify-between">
      <button class="btn" @click="prev" :disabled="step === 1">Voltar</button>

      <button class="btn btn-primary" @click="onPrimary" :disabled="!canNext">
        {{ step === 4 ? "Concluir (Salvar)" : "Avançar" }}
      </button>
    </div>

    <!-- Modal: Meus projetos -->
    <div
      v-if="showProjetos"
      class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      @click.self="showProjetos = false"
    >
      <div class="w-full max-w-2xl">
        <MeusProjetos
          @close="showProjetos = false"
          @open="openProject"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "@/stores/app";

import ProjetoForm from "@/components/ProjetoForm.vue";
import AmbientesEditor from "@/components/AmbientesEditor.vue";
import ProdutosEditor from "@/components/ProdutosEditor.vue";
import ResumoPorProduto from "@/components/ResumoPorProduto.vue";
import Projeto3D from "@/components/Projeto3D.vue";
import ExportarPdfButton from "@/components/ExportarPdfButton.vue";
import MeusProjetos from "@/components/MeusProjetos.vue";

const store = useAppStore();
const step = ref(1);
const showProjetos = ref(false);

const canNext = computed(() => {
  if (step.value === 1) return (store.ambientes?.length || 0) > 0;
  if (step.value === 2) return true;
  if (step.value === 3) return (store.produtos?.length || 0) > 0;
  return true;
});

function resetWizard() {
  store.resetAll();
  step.value = 1;
}

function prev() {
  if (step.value > 1) step.value -= 1;
}

function onPrimary() {
  if (step.value < 4) {
    step.value += 1;
    return;
  }
  // Step 4: Concluir (Salvar)
  saveProject();
}

function saveProject() {
  // ✅ salva snapshot do projeto atual
  store.saveCurrentProject();
  // aqui você pode colocar um toast depois
}

function openProject(projectId) {
  const ok = store.loadProjectById(projectId);
  if (ok) {
    step.value = 4;           // vai direto para resumo (export PDF)
    showProjetos.value = false;
  }
}
</script>
