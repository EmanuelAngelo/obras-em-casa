<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Obras em Casa</h1>
        <div class="text-body-2 text-medium-emphasis">
          Tudo salvo automaticamente em cookies (não perde ao recarregar).
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <ProjetoForm />
      </v-col>

      <v-col cols="12" md="6">
        <ResumoCompra />
      </v-col>

      <v-col cols="12">
        <AmbientesEditor />
      </v-col>

      <v-col cols="12">
        <RevestimentosEditor />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ProjetoForm from "@/components/ProjetoForm.vue";
import AmbientesEditor from "@/components/AmbientesEditor.vue";
import RevestimentosEditor from "@/components/RevestimentosEditor.vue";
import ResumoCompra from "@/components/ResumoCompra.vue";
</script>
