export function defaultState() {
  return {
    schemaVersion: 2,

    projeto: {
      nome: "",
      createdAt: new Date().toISOString(),
    },
    ambientes: [],
    produtos: [],
    projetos: [],
  };
}
