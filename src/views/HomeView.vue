<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
    <!-- Navbar -->
    <div class="navbar bg-base-100 rounded-box shadow">
      <div class="flex-1">
        <div class="text-xl font-bold">Obras em Casa</div>
        <div class="text-sm opacity-70 ml-3 hidden sm:block">
          Planeje sua compra de pisos como na vida real
        </div>
      </div>
      <div class="flex-none gap-2">
        <button class="btn btn-outline" @click="store.resetAll()">
          Zerar tudo
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProjetoForm />
      <ResumoCompra />
    </div>

    <AmbientesEditor />
    <RevestimentosEditor />
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import ProjetoForm from "@/components/ProjetoForm.vue";
import AmbientesEditor from "@/components/AmbientesEditor.vue";
import RevestimentosEditor from "@/components/RevestimentosEditor.vue";
import ResumoCompra from "@/components/ResumoCompra.vue";

const store = useAppStore();
</script>
