import { defineStore } from "pinia";
import { defaultState } from "@/models/defaults";
import { loadState, saveState, clearState } from "@/services/cookieStorage";

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export const useAppStore = defineStore("app", {
  state: () => loadState() ?? defaultState(),

  getters: {
    // área total por tipo (chão/parede)
    totalAreaChao(state) {
      return state.ambientes
        .filter((a) => a.tipo === "chao")
        .reduce((sum, a) => sum + (Number(a.area) || 0), 0);
    },
    totalAreaParede(state) {
      return state.ambientes
        .filter((a) => a.tipo === "parede")
        .reduce((sum, a) => sum + (Number(a.area) || 0), 0);
    },
  },

  actions: {
    setProjetoNome(nome) {
      this.projeto.nome = nome;
      this._persist();
    },

    addAmbiente({ nome = "", tipo = "chao", area = 0 } = {}) {
      this.ambientes.push({ id: uid("amb"), nome, tipo, area });
      this._persist();
    },

    updateAmbiente(id, patch) {
      const idx = this.ambientes.findIndex((a) => a.id === id);
      if (idx >= 0) {
        this.ambientes[idx] = { ...this.ambientes[idx], ...patch };
        this._persist();
      }
    },

    removeAmbiente(id) {
      this.ambientes = this.ambientes.filter((a) => a.id !== id);
      this._persist();
    },

    setRevestimento(tipo, patch) {
      this.revestimentos[tipo] = { ...this.revestimentos[tipo], ...patch };
      this._persist();
    },

    resetAll() {
      const fresh = defaultState();
      Object.assign(this, fresh);
      clearState();
      this._persist();
    },

    _persist() {
      // salva o estado inteiro
      saveState({
        projeto: this.projeto,
        ambientes: this.ambientes,
        revestimentos: this.revestimentos,
      });
    },
  },
});
