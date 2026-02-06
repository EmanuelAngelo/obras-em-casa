<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <RevestimentoCard tipo="piso" titulo="Piso (chão)" />
    <RevestimentoCard tipo="parede" titulo="Revestimento (parede)" />
  </div>
</template>

<script setup>
import RevestimentoCard from "@/components/RevestimentoCard.vue";
</script>
