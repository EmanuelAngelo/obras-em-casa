export function defaultState() {
  return {
    projeto: {
      nome: "",
      createdAt: new Date().toISOString(),
    },
    ambientes: [
      // exemplo:
      // { id: "amb-1", nome: "Sala", tipo: "chao", area: 0 }
    ],
    revestimentos: {
      piso: {
        nome: "",
        dimensaoCm: { largura: 0, comprimento: 0 }, // ex: 60x60
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        perdaPercent: 10,
      },
      parede: {
        nome: "",
        dimensaoCm: { largura: 0, comprimento: 0 },
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        perdaPercent: 10,
      },
    },
  };
}
