# 🏠 Obras em Casa

**Planejador inteligente de compra de pisos e revestimentos com cálculo realista de obra e visualização 3D dinâmica.**

Este projeto nasceu de uma dor real: ir à loja de material de construção, ver a etiqueta do piso e **não saber quantas caixas comprar**. A partir disso, o *Obras em Casa* evoluiu para um **planejador completo**, que calcula áreas como na vida real e ainda gera uma **prévia 3D automática do projeto**.

---

## 🎯 Objetivo do Projeto

Ajudar qualquer pessoa (leigo ou profissional) a:
- Calcular corretamente pisos e revestimentos
- Evitar compra errada de caixas
- Considerar perdas, box, portas e janelas
- Visualizar o projeto em 3D antes da compra
- Levar para a loja uma lista clara e confiável

---

## 🚀 Funcionalidades Principais

### 🏗️ Ambientes (Cálculo Real de Obra)
- Cadastro de ambientes por **largura × comprimento (m)**
- Área de piso calculada automaticamente
- Revestimento de parede por **perímetro × altura**
- Descontos de área para:
  - Portas
  - Janelas
  - Outros recortes

### 🚿 Box do Banheiro (inteligência automática)
- O box só aparece se o ambiente for reconhecido como **banheiro**
  - Funciona para: `Banheiro`, `banheiro casal`, `Banheiro suíte`, `banheiro de baixo`, etc.
- Cálculo do box com **3 paredes**
- Altura própria do box
- Descontos específicos do box

### 🏷️ Produtos / Revestimentos (modelo de etiqueta de loja)
Baseado em etiquetas reais de lojas como a Potiguar:

```
Piso 46x46cm Tipo A Ipanema Bege Cerbras - 2,30m²
R$ 34,90 (por m²)
Você vai precisar de 1 caixa
Valor: R$ 80,27
```

O sistema trabalha com:
- m² por caixa
- preço por m²
- preço por caixa (calculado automaticamente)
- percentual de perda (10%, 15%, 20% ou personalizado)

### 📊 Resumo de Compra (estilo loja)
- Área necessária (com perda)
- Área efetivamente comprada
- Quantidade de caixas (arredondamento real)
- Valor por caixa
- Valor total

Texto no formato:
> “Você vai precisar de X caixas. Valor total: R$ Y.”

---

## 🧱 Visualização 3D Dinâmica (Diferencial Forte)

O projeto gera automaticamente um **preview 3D** com base nos dados informados:

- Piso como base volumétrica
- Paredes com altura real
- Box do banheiro em formato U (3 paredes)
- Organização automática dos ambientes no espaço
- Câmera com controle livre (OrbitControls)

⚠️ **Não é mock nem imagem fake** — o 3D é calculado em tempo real a partir das medidas reais do projeto.

---

## 🧠 Inteligência do Sistema

- Reconhecimento automático de ambientes do tipo banheiro
- Desativação automática do box se o ambiente deixar de ser banheiro
- Prevenção de áreas negativas (descontos maiores que a parede)
- Arredondamento sempre para cima (caixas inteiras)

---

## 💾 Persistência de Dados

- Salvamento automático em cookies
- Dados mantidos mesmo ao fechar o navegador
- Estrutura preparada para versionamento de schema

---

## 🎨 Interface

- **Tailwind CSS**
- **daisyUI**
- Design limpo, moderno e mobile-friendly
- Preparado para uso como **PWA**

---

## 🧩 Stack Técnica

- **Vue 3** (Composition API)
- **Vite**
- **Pinia** (estado global)
- **Vue Router + Layouts**
- **Tailwind CSS + daisyUI**
- **Three.js** (visualização 3D)

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── AmbientesEditor.vue
│   ├── Projeto3D.vue
│   ├── ProjetoForm.vue
│   ├── RevestimentoCard.vue
│   ├── RevestimentosEditor.vue
│   └── ResumoCompra.vue
│
├── models/
│   └── defaults.js
│
├── services/
│   └── cookieStorage.js
│
├── stores/
│   └── app.store.js
│
├── styles/
│   └── main.css
│
├── views/
│   └── HomeView.vue
│
└── main.js
```

---

## ▶️ Como Rodar o Projeto

```bash
npm install
npm run dev
```

Acesse:
```
http://localhost:3000
```

---

## 🗺️ Roadmap

### Próximos passos planejados
- Produtos como lista (múltiplos pisos e revestimentos)
- Vínculo produto ↔ ambientes / box
- Resumo separado por produto
- Texturas no 3D (piso, parede, box)
- Exportar imagem do projeto 3D
- Exportar PDF / checklist de compra
- Modo Wizard (passo a passo)
- PWA instalável (ícone no celular)

---

## 👨‍💻 Autor

Projeto criado a partir de uma necessidade real de obra, evoluindo para uma ferramenta profissional de planejamento.

**Manel**

---

## 📄 Licença

Uso livre para fins educacionais e pessoais.

---

🚀 *Este projeto já resolve um problema real — e ainda está em evolução.*

