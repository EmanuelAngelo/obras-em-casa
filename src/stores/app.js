// src/stores/app.store.js
import { defineStore } from "pinia";
import { defaultState } from "@/models/defaults";
import { loadState, saveState, clearState } from "@/services/cookieStorage";

/* -----------------------------
 * Helpers de cálculo (ambientes)
 * ----------------------------- */
function areaPisoAmbiente(a) {
  const w = Number(a.dimensoes?.larguraM) || 0;
  const l = Number(a.dimensoes?.comprimentoM) || 0;
  return w * l;
}

function descontosArea(descontos = []) {
  return (descontos || []).reduce((s, d) => {
    const w = Number(d.larguraM) || 0;
    const h = Number(d.alturaM) || 0;
    const qtd = Number(d.qtd) || 1;
    return s + w * h * qtd;
  }, 0);
}

function areaParedeAmbiente(a) {
  if (!a.parede?.aplicar) return 0;

  const w = Number(a.dimensoes?.larguraM) || 0;
  const l = Number(a.dimensoes?.comprimentoM) || 0;
  const h = Number(a.parede?.alturaM) || 0;

  const per = 2 * (w + l);
  const area = per * h - descontosArea(a.parede?.descontos);
  return Math.max(0, area);
}

function areaBoxAmbiente(a) {
  if (!a.box?.aplicar) return 0;

  const bw = Number(a.box?.larguraM) || 0;
  const bl = Number(a.box?.comprimentoM) || 0;
  const bh = Number(a.box?.alturaM) || 0;

  // 3 paredes (U): (2*largura + comprimento) * altura
  const per3 = 2 * bw + bl;
  const area = per3 * bh - descontosArea(a.box?.descontos);
  return Math.max(0, area);
}

/* -----------------------------
 * Utils
 * ----------------------------- */
function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


/* -----------------------------
 * Migração / Normalização do state
 * ----------------------------- */
function normalizeState(raw) {
  const base = defaultState();

  // nada salvo
  if (!raw || typeof raw !== "object") {
    return {
      ...base,
      schemaVersion: 2,
      ambientes: Array.isArray(base.ambientes) ? base.ambientes : [],
      produtos: Array.isArray(base.produtos) ? base.produtos : [],
    };
  }

  const schema = Number(raw.schemaVersion || 1);

  // mescla com defaults para garantir chaves novas
  const merged = { ...base, ...raw };

  // garante arrays
  if (!Array.isArray(merged.ambientes)) merged.ambientes = [];
  if (!Array.isArray(merged.produtos)) merged.produtos = [];
  if (!Array.isArray(merged.projetos)) merged.projetos = [];


  // garante estrutura mínima dos ambientes (para não quebrar cálculos)
  merged.ambientes = merged.ambientes.map((a) => ({
    id: a.id || uid("amb"),
    nome: a.nome || "",
    dimensoes: {
      larguraM: Number(a.dimensoes?.larguraM) || 0,
      comprimentoM: Number(a.dimensoes?.comprimentoM) || 0,
    },
    parede: {
      aplicar: Boolean(a.parede?.aplicar),
      alturaM: Number(a.parede?.alturaM) || 0,
      descontos: Array.isArray(a.parede?.descontos) ? a.parede.descontos : [],
    },
    box: {
      aplicar: Boolean(a.box?.aplicar),
      larguraM: Number(a.box?.larguraM) || 0,
      comprimentoM: Number(a.box?.comprimentoM) || 0,
      alturaM: Number(a.box?.alturaM) || 0,
      descontos: Array.isArray(a.box?.descontos) ? a.box.descontos : [],
    },
  }));

  // Migração: se veio do schema antigo com revestimentos, cria produtos iniciais
  if (schema < 2 && raw.revestimentos && merged.produtos.length === 0) {
    const r = raw.revestimentos;

    if (r?.piso) {
      merged.produtos.push({
        id: uid("prod"),
        nome: r.piso.nome || "Piso",
        aplicaEm: "piso",
        ambientes: [], // usuário vai vincular
        caixas: { m2PorCaixa: Number(r.piso.caixas?.m2PorCaixa) || 0 },
        preco: { porM2: Number(r.piso.preco?.porM2) || 0 },
        perdaPercent: Number(r.piso.perdaPercent) || 10,
      });
    }

    if (r?.parede) {
      merged.produtos.push({
        id: uid("prod"),
        nome: r.parede.nome || "Revestimento de Parede",
        aplicaEm: "parede",
        ambientes: [],
        caixas: { m2PorCaixa: Number(r.parede.caixas?.m2PorCaixa) || 0 },
        preco: { porM2: Number(r.parede.preco?.porM2) || 0 },
        perdaPercent: Number(r.parede.perdaPercent) || 10,
      });
    }
  }

  // Normaliza produtos para sempre ter campos
  merged.produtos = merged.produtos.map((p) => ({
    id: p.id || uid("prod"),
    nome: p.nome || "",
    aplicaEm: p.aplicaEm || "piso", // piso | parede | box
    ambientes: Array.isArray(p.ambientes) ? p.ambientes : [],
    caixas: { m2PorCaixa: Number(p.caixas?.m2PorCaixa) || 0 },
    preco: { porM2: Number(p.preco?.porM2) || 0 },
    perdaPercent: Number(p.perdaPercent) || 10,
  }));

  merged.schemaVersion = 2;
  // não precisamos mais manter revestimentos
  delete merged.revestimentos;

  return merged;
}

/* -----------------------------
 * Store
 * ----------------------------- */
export const useAppStore = defineStore("app", {
  state: () => ({
    ...normalizeState(loadState()),
    dirty: false,
  }),

  getters: {
    // Soma total de áreas (úteis para exibir no topo)
    totalAreaChao(state) {
      return (state.ambientes || []).reduce((sum, a) => sum + areaPisoAmbiente(a), 0);
    },

    totalAreaParede(state) {
      return (state.ambientes || []).reduce((sum, a) => {
        return sum + areaParedeAmbiente(a) + areaBoxAmbiente(a);
      }, 0);
    },

    // ✅ Resumo por produto (o coração do Bloco 2)
    resumoPorProduto(state) {
      const ambientes = state.ambientes || [];
      const produtos = state.produtos || [];

      return produtos.map((p) => {
        let areaBase = 0;

        (p.ambientes || []).forEach((ambId) => {
          const a = ambientes.find((x) => x.id === ambId);
          if (!a) return;

          if (p.aplicaEm === "piso") areaBase += areaPisoAmbiente(a);
          if (p.aplicaEm === "parede") areaBase += areaParedeAmbiente(a);
          if (p.aplicaEm === "box") areaBase += areaBoxAmbiente(a);
        });

        const perda = (Number(p.perdaPercent) || 0) / 100;
        const areaNecessaria = areaBase * (1 + perda);

        const m2PorCaixa = Number(p.caixas?.m2PorCaixa) || 0;
        const caixas = m2PorCaixa ? Math.ceil(areaNecessaria / m2PorCaixa) : 0;
        const m2Comprado = caixas * m2PorCaixa;

        const precoPorM2 = Number(p.preco?.porM2) || 0;
        const precoPorCaixa = m2PorCaixa && precoPorM2 ? m2PorCaixa * precoPorM2 : 0;
        const total = caixas && precoPorCaixa ? caixas * precoPorCaixa : 0;

        return {
          ...p,
          areaBase,
          areaNecessaria,
          caixas,
          m2Comprado,
          precoPorCaixa,
          total,
        };
      });
    },
  },

  actions: {
        markDirty() {
          this.dirty = true;
        },
        markSaved() {
          this.dirty = false;
        },
    /* -------- Projeto -------- */
    setProjetoNome(nome) {
      this.projeto.nome = nome;
      this.markDirty();
      this._persist();
    },

    /* -------- Produtos -------- */
    addProduto(payload = {}) {
      if (!Array.isArray(this.produtos)) this.produtos = [];

      this.produtos.push({
        id: uid("prod"),
        nome: payload.nome || "",
        aplicaEm: payload.aplicaEm || "piso", // piso | parede | box
        ambientes: [],
        caixas: { m2PorCaixa: Number(payload.m2PorCaixa) || 0 },
        preco: { porM2: Number(payload.precoPorM2) || 0 },
        perdaPercent: Number(payload.perdaPercent) || 10,
      });
      this.markDirty();
      this._persist();
    },

    updateProduto(id, patch) {
      const i = (this.produtos || []).findIndex((p) => p.id === id);
      if (i >= 0) {
        const atual = this.produtos[i];

        // merge inteligente para objetos aninhados
        const next = { ...atual, ...patch };

        if (patch.caixas) next.caixas = { ...atual.caixas, ...patch.caixas };
        if (patch.preco) next.preco = { ...atual.preco, ...patch.preco };
        if (patch.ambientes) next.ambientes = Array.isArray(patch.ambientes) ? patch.ambientes : atual.ambientes;

        this.produtos[i] = next;
        this.markDirty();
        this._persist();
      }
    },

    removeProduto(id) {
      this.produtos = (this.produtos || []).filter((p) => p.id !== id);
      this.markDirty();
      this._persist();
    },

    toggleProdutoAmbiente(produtoId, ambienteId) {
      const p = (this.produtos || []).find((x) => x.id === produtoId);
      if (!p) return;

      const set = new Set(p.ambientes || []);
      set.has(ambienteId) ? set.delete(ambienteId) : set.add(ambienteId);
      p.ambientes = Array.from(set);
      this.markDirty();
      this._persist();
    },

    /* -------- Ambientes -------- */
    addAmbiente({ nome = "", larguraM = 0, comprimentoM = 0 } = {}) {
      if (!Array.isArray(this.ambientes)) this.ambientes = [];

      this.ambientes.push({
        id: uid("amb"),
        nome,
        dimensoes: { larguraM, comprimentoM },
        parede: { aplicar: false, alturaM: 0, descontos: [] },
        box: { aplicar: false, larguraM: 0, comprimentoM: 0, alturaM: 0, descontos: [] },
      });
      this.markDirty();
      this._persist();
    },

    updateAmbiente(id, patch) {
      const idx = (this.ambientes || []).findIndex((a) => a.id === id);
      if (idx >= 0) {
        const atual = this.ambientes[idx];
        const next = { ...atual, ...patch };

        if (patch.dimensoes) next.dimensoes = { ...atual.dimensoes, ...patch.dimensoes };
        if (patch.parede) next.parede = { ...atual.parede, ...patch.parede };
        if (patch.box) next.box = { ...atual.box, ...patch.box };

        this.ambientes[idx] = next;
        this.markDirty();
        this._persist();
      }
    },

    removeAmbiente(id) {
      this.ambientes = (this.ambientes || []).filter((a) => a.id !== id);
      // remove o ambiente de qualquer produto que esteja vinculando
      this.produtos = (this.produtos || []).map((p) => ({
        ...p,
        ambientes: (p.ambientes || []).filter((ambId) => ambId !== id),
      }));
      this.markDirty();
      this._persist();
    },

    /* -------- Descontos -------- */
    addDesconto(ambienteId, alvo /* "parede" | "box" */, payload = {}) {
      const a = (this.ambientes || []).find((x) => x.id === ambienteId);
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
      this.markDirty();
    },

    removeDesconto(ambienteId, alvo, descontoId) {
      const a = (this.ambientes || []).find((x) => x.id === ambienteId);
      if (!a) return;

      const key = alvo === "box" ? "box" : "parede";
      const descontos = (a[key]?.descontos || []).filter((d) => d.id !== descontoId);

      this.updateAmbiente(ambienteId, {
        [key]: { ...a[key], descontos },
      });
      this.markDirty();
    },

    /* -------- Reset / Persist -------- */
    resetAll() {
      const keep = Array.isArray(this.projetos) ? this.projetos : [];
      const fresh = defaultState();
      Object.assign(this, fresh);
      this.projetos = keep;   // ✅ mantém os projetos salvos
      clearState();
      this._persist();
    },


    _persist() {
      saveState({
        schemaVersion: this.schemaVersion || 2,
        projeto: this.projeto,
        ambientes: this.ambientes,
        produtos: this.produtos,
        projetos: this.projetos,
      });
    },

    /* Salvando projetos */

    saveCurrentProject() {
      if (!Array.isArray(this.projetos)) this.projetos = [];

      const nome = (this.projeto?.nome || "").trim() || `Projeto ${this.projetos.length + 1}`;
      let id = this.projeto?.id;
      let createdAt = this.projeto?.createdAt;
      if (!id) {
        id = uid("proj");
        createdAt = new Date().toISOString();
      }

      const snapshot = {
        id,
        nome,
        createdAt,
        data: {
          schemaVersion: this.schemaVersion || 2,
          projeto: { ...deepClone(this.projeto || {}), nome, id, createdAt },
          ambientes: deepClone(this.ambientes || []),
          produtos: deepClone(this.produtos || []),
        },
      };

      // Atualiza se já existe, senão adiciona
      const idx = this.projetos.findIndex(p => p.id === id);
      if (idx >= 0) {
        this.projetos[idx] = snapshot;
      } else {
        this.projetos.unshift(snapshot);
      }
      this.projeto.id = id;
      this.projeto.createdAt = createdAt;
      this._persist();
      this.markSaved();
      return id;
    },



    loadProjectById(projectId) {
      const p = (this.projetos || []).find((x) => x.id === projectId);
      if (!p) return false;

      this.schemaVersion = p.data.schemaVersion || 2;
      this.projeto = deepClone(p.data.projeto || {});
      this.ambientes = deepClone(p.data.ambientes || []);
      this.produtos = deepClone(p.data.produtos || []);

      this._persist();
      return true;
    },



    deleteProjectById(projectId) {
      this.projetos = (this.projetos || []).filter(x => x.id !== projectId);
      this._persist();
    },

  },
});
