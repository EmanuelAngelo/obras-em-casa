export function defaultState() {
  return {
    projeto: {
      nome: "",
      createdAt: new Date().toISOString(),
    },

    ambientes: [
      // Exemplo:
      // {
      //   id: "amb-1",
      //   nome: "Sala",
      //   dimensoes: { larguraM: 0, comprimentoM: 0 },
      //   parede: { aplicar: false, alturaM: 0 },
      // }
    ],

    revestimentos: {
      piso: {
        nome: "",
        dimensaoCm: { largura: 0, comprimento: 0 },
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        preco: { porM2: 0 },
        perdaPercent: 10,
      },
      parede: {
        nome: "",
        dimensaoCm: { largura: 0, comprimento: 0 },
        caixas: { m2PorCaixa: 0, pecasPorCaixa: 0 },
        preco: { porM2: 0 },
        perdaPercent: 10,
      },
    },
  };
}
