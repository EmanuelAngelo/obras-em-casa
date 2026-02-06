export function defaultState() {
  return {
    projeto: {
      nome: "",
      createdAt: new Date().toISOString(),
    },
    ambientes: [],
    revestimentos: {
      piso: {
        nome: "",
        dimensaoCm: { largura: 0, comprimento: 0 },
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        preco: { porM2: 0 }, // ✅ NOVO
        perdaPercent: 10,
      },
      parede: {
        nome: "",
        dimensaoCm: { largura: 0, comprimento: 0 },
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        preco: { porM2: 0 }, // ✅ NOVO
        perdaPercent: 10,
      },
    },
  };
}
