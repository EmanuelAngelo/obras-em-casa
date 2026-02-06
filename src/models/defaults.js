export function defaultState() {
  return {
    projeto: { nome: "", createdAt: new Date().toISOString() },

    ambientes: [],

    // ainda mantemos isso por enquanto; no BLOCO 2 vamos trocar por lista de produtos
    revestimentos: {
      piso: {
        nome: "",
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        preco: { porM2: 0 },
        perdaPercent: 10,
      },
      parede: {
        nome: "",
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        preco: { porM2: 0 },
        perdaPercent: 10,
      },
    },
  };
}
