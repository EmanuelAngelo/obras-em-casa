<template>
  <v-card rounded="lg">
    <v-card-title>Revestimentos</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <RevestimentoCard tipo="piso" titulo="Piso (chão)" />
        </v-col>
        <v-col cols="12" md="6">
          <RevestimentoCard tipo="parede" titulo="Revestimento (parede)" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import RevestimentoCard from "@/components/RevestimentoCard.vue";
</script>
