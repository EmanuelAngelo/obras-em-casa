import { defineStore } from "pinia";
import { defaultState } from "@/models/defaults";
import { loadState, saveState, clearState } from "@/services/cookieStorage";


function descontosArea(descontos = []) {
  return (descontos || []).reduce((s, d) => {
    const w = Number(d.larguraM) || 0;
    const h = Number(d.alturaM) || 0;
    const qtd = Number(d.qtd) || 1;
    return s + w * h * qtd;
  }, 0);
}


function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export const useAppStore = defineStore("app", {
  state: () => loadState() ?? defaultState(),

  getters: {
    // área total por tipo (chão/parede)
    totalAreaChao(state) {
      return state.ambientes.reduce((sum, a) => {
        const w = Number(a.dimensoes?.larguraM) || 0;
        const l = Number(a.dimensoes?.comprimentoM) || 0;
        return sum + w * l;
      }, 0);
    },

    totalAreaParede(state) {
      return state.ambientes.reduce((sum, a) => {
        // Parede principal
        const paredeAplicar = Boolean(a.parede?.aplicar);
        let areaParede = 0;

        if (paredeAplicar) {
          const w = Number(a.dimensoes?.larguraM) || 0;
          const l = Number(a.dimensoes?.comprimentoM) || 0;
          const h = Number(a.parede?.alturaM) || 0;
          const perimetro = 2 * (w + l);
          areaParede = perimetro * h - descontosArea(a.parede?.descontos);
          if (areaParede < 0) areaParede = 0;
        }

        // Box (3 paredes) = (2*largura + comprimento) * altura
        const boxAplicar = Boolean(a.box?.aplicar);
        let areaBox = 0;

        if (boxAplicar) {
          const bw = Number(a.box?.larguraM) || 0;
          const bl = Number(a.box?.comprimentoM) || 0;
          const bh = Number(a.box?.alturaM) || 0;
          const perimetro3 = 2 * bw + bl;
          areaBox = perimetro3 * bh - descontosArea(a.box?.descontos);
          if (areaBox < 0) areaBox = 0;
        }

        return sum + areaParede + areaBox;
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

        // Parede principal do ambiente
        parede: {
          aplicar: false,
          alturaM: 0,
          descontos: [
            // { id, tipo: "porta"|"janela"| "outro", larguraM, alturaM, qtd }
          ],
        },

        // Box do banheiro (3 paredes)
        box: {
          aplicar: false,
          larguraM: 0,
          comprimentoM: 0,
          alturaM: 0,
          descontos: [],
        },
      });
      this._persist();
    },

    addDesconto(ambienteId, alvo /* "parede" | "box" */, payload = {}) {
      const a = this.ambientes.find(x => x.id === ambienteId);
      if (!a) return;

      const item = {
        id: uid("desc"),
        tipo: payload.tipo || "porta",
        larguraM: Number(payload.larguraM) || 0,
        alturaM: Number(payload.alturaM) || 0,
        qtd: Number(payload.qtd) || 1,
      };

      const key = alvo === "box" ? "box" : "parede";
      const descontos = a[key]?.descontos || [];
      this.updateAmbiente(ambienteId, {
        [key]: { ...a[key], descontos: [...descontos, item] },
      });
    },

    removeDesconto(ambienteId, alvo, descontoId) {
      const a = this.ambientes.find(x => x.id === ambienteId);
      if (!a) return;

      const key = alvo === "box" ? "box" : "parede";
      const descontos = (a[key]?.descontos || []).filter(d => d.id !== descontoId);

      this.updateAmbiente(ambienteId, {
        [key]: { ...a[key], descontos },
      });
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
