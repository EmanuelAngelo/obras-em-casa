export function defaultState() {
  return {
    schemaVersion: 2,

    projeto: {
      nome: "",
      createdAt: new Date().toISOString(),
    },

    ambientes: [],

    produtos: [
      // {
      //   id,
      //   nome,
      //   aplicaEm: "piso" | "parede" | "box",
      //   ambientes: [], // ids
      //   caixas: { m2PorCaixa: 0 },
      //   preco: { porM2: 0 },
      //   perdaPercent: 10,
      // }
    ],
  };
}
