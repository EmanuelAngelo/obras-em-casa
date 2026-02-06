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
      // soma (largura × comprimento) de cada ambiente
      return state.ambientes.reduce((sum, a) => {
        const w = Number(a.dimensoes?.larguraM) || 0;
        const l = Number(a.dimensoes?.comprimentoM) || 0;
        return sum + w * l;
      }, 0);
    },

    totalAreaParede(state) {
      // soma (perímetro × altura) dos ambientes com parede.aplicar
      return state.ambientes.reduce((sum, a) => {
        const aplicar = Boolean(a.parede?.aplicar);
        if (!aplicar) return sum;

        const w = Number(a.dimensoes?.larguraM) || 0;
        const l = Number(a.dimensoes?.comprimentoM) || 0;
        const h = Number(a.parede?.alturaM) || 0;

        const perimetro = 2 * (w + l);
        return sum + perimetro * h;
      }, 0);
    },

  },

  actions: {
    setProjetoNome(nome) {
      this.projeto.nome = nome;
      this._persist();
    },

    addAmbiente({ nome = "", larguraM = 0, comprimentoM = 0 } = {}) {
      this.ambientes.push({
        id: uid("amb"),
        nome,
        dimensoes: { larguraM, comprimentoM },
        parede: { aplicar: false, alturaM: 0 },
      });
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
