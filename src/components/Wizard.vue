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
        <button class="btn btn-outline" @click="resetWizard">Zerar tudo</button>
      </div>
    </div>

    <!-- Steps -->
    <ul
      class="steps steps-vertical lg:steps-horizontal w-full bg-base-100 rounded-box shadow p-4"
    >
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
          <span
            >Cadastre os produtos conforme a etiqueta e vincule aos
            ambientes.</span
          >
        </div>
        <ProdutosEditor />
      </template>

      <template v-else>
        <div class="flex items-center justify-between gap-3">
          <div class="text-lg font-bold">Resumo final</div>
          <div class="flex gap-2">
            <ExportarPdfButton />
            <button
              class="btn btn-primary"
              @click="saveProject"
              :disabled="saving"
            >
              <span v-if="!saving">Salvar projeto</span>
              <span v-else class="loading loading-spinner loading-sm"></span>
            </button>
          </div>
        </div>

        <ResumoPorProduto />
        <Projeto3D />
      </template>
    </div>

    <!-- Navegação -->
    <div class="flex justify-between">
      <button class="btn" @click="prev" :disabled="step === 1 || saving">
        Voltar
      </button>

      <button
        class="btn btn-primary"
        @click="onPrimary"
        :disabled="!canNext || saving"
      >
        <span v-if="step !== 4">Avançar</span>
        <span v-else>
          <span v-if="!saving">Concluir (Salvar)</span>
          <span v-else class="loading loading-spinner loading-sm"></span>
        </span>
      </button>
    </div>

    <!-- Modal: Meus projetos -->
    <div
      v-if="showProjetos"
      class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      @click.self="showProjetos = false"
    >
      <div class="w-full max-w-2xl">
        <MeusProjetos @close="showProjetos = false" @open="openProject" />
      </div>
    </div>
    <!-- Overlay de salvamento (trava ações) -->
    <div
      v-if="saving"
      class="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
    >
      <div
        class="bg-base-100 rounded-box shadow p-6 w-full max-w-sm text-center"
      >
        <div class="flex justify-center mb-3">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div class="font-bold text-lg">Salvando projeto…</div>
        <div class="text-sm opacity-70 mt-1">Aguarde só um instante.</div>
      </div>
    </div>

    <!-- Toast de sucesso -->
    <div class="toast toast-top toast-end z-[1000]" v-if="toast.show">
      <div class="alert alert-success shadow">
        <span>{{ toast.message }}</span>
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
const saving = ref(false);

const toast = ref({
  show: false,
  message: "",
});

function showToast(message, ms = 2500) {
  toast.value = { show: true, message };
  setTimeout(() => {
    toast.value.show = false;
  }, ms);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resetWizard() {
  if (saving.value) return;
  store.resetAll();
  step.value = 1;
}

function prev() {
  if (step.value > 1) step.value -= 1;
}

function onPrimary() {
  if (saving.value) return;
  if (step.value < 4) {
    step.value += 1;
    return;
  }
  // Step 4: Concluir (Salvar)
  saveProject();
}


async function saveProject() {
  if (saving.value) return;

  saving.value = true;

  try {
    // opcional: aqui você poderia validar se tem ambientes/produtos
    store.saveCurrentProject();

    // trava 3s (como você pediu)
    await sleep(3000);

    showToast("✅ Projeto salvo com sucesso!");
  } catch (e) {
    console.error(e);
    showToast("❌ Erro ao salvar o projeto.", 3000);
  } finally {
    saving.value = false;
  }
}

function openProject(projectId) {
  if (saving.value) return;
  const ok = store.loadProjectById(projectId);
  if (ok) {
    step.value = 4;
    showProjetos.value = false;
  }
}

</script>
