<template>
  <div class="min-h-screen bg-base-200">
    <router-view />
    <div v-if="showWelcomeDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Bem-vindo ao Obras em Casa!</h2>
          <p>
            Este sistema ajuda você a planejar sua obra, calcular pisos e revestimentos, exportar PDF de compra, visualizar em 3D e muito mais.<br><br>
            Siga o passo a passo e aproveite todos os recursos!
          </p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary" @click="closeWelcome">Entendi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showWelcomeDialog = ref(false);

onMounted(() => {
  if (!localStorage.getItem('obras-welcome-shown')) {
    showWelcomeDialog.value = true;
  }
});

function closeWelcome() {
  showWelcomeDialog.value = false;
  localStorage.setItem('obras-welcome-shown', '1');
}
</script>
