# 🏠 Obras em Casa

**Planejador inteligente de compra de pisos e revestimentos, com cálculo real de obra, fluxo guiado (wizard), exportação de PDF e visualização 3D dinâmica.**

Este projeto nasceu de uma dor real: ir à loja de material de construção, olhar a etiqueta do piso e **não saber quantas caixas comprar**. A partir disso, o *Obras em Casa* evoluiu para uma aplicação completa, pensada para uso real em obra, loja ou atendimento a clientes.

---

## 🎯 Objetivo do Projeto

Ajudar qualquer pessoa — leigo, proprietário, vendedor ou profissional da construção — a:

- Calcular corretamente pisos e revestimentos
- Evitar desperdício e compras erradas
- Considerar paredes, box, portas e janelas
- Simular perdas reais de obra
- Gerar um **checklist de compra em PDF**
- Visualizar o projeto em **3D automático**
- Usar o app como **PWA instalável no celular**

---

## 🚀 Funcionalidades Implementadas

### 🧭 Wizard (Fluxo Guiado)
A aplicação funciona em um fluxo passo a passo:

1. **Projeto & Ambientes**
2. **Paredes, Box e Descontos**
3. **Produtos e Vínculos**
4. **Resumo Final + 3D + PDF**

Esse modelo reduz erros e torna o app acessível para qualquer usuário.

---

### 🏗️ Ambientes (Cálculo Real de Obra)

- Cadastro de ambientes por **largura × comprimento (m)**
- Cálculo automático de área de piso
- Revestimento de parede por **perímetro × altura**
- Descontos configuráveis:
  - Portas
  - Janelas
  - Outros recortes

---

### 🚿 Box do Banheiro (Inteligência Automática)

- O box só é exibido se o ambiente for reconhecido como **banheiro**
  - Funciona para: `Banheiro`, `Banheiro casal`, `banheiro suíte`, `banheiro de baixo`, etc.
- Cálculo com **3 paredes (formato U)**
- Altura própria do box
- Descontos específicos (ex.: porta do box)

---

### 🏷️ Produtos / Revestimentos (Modelo de Loja)

O cadastro de produtos segue exatamente o modelo das etiquetas reais:

```
Piso 46x46cm Tipo A Ipanema Bege Cerbras
2,30 m² por caixa
R$ 34,90 / m²
```

O sistema trabalha com:

- m² por caixa (digitado pelo usuário)
- preço por m² (digitado pelo usuário)
- **preço por caixa calculado automaticamente**
- percentual de perda configurável (ex.: 10%, 15%, 20%)

Cada produto pode ser vinculado a **um ou mais ambientes**.

---

### 📊 Resumo de Compra (Por Produto)

Para cada produto, o sistema calcula:

- Área base
- Área necessária (com perda)
- Quantidade de caixas (arredondamento real)
- m² comprados
- Preço por caixa
- Valor total

Texto no padrão de loja:

> “Você vai precisar de X caixas. Valor total: R$ Y.”

---

### 🧱 Visualização 3D Dinâmica

O projeto gera automaticamente um **preview 3D** com base nos dados informados:

- Piso com área real
- Paredes com altura configurada
- Box do banheiro em 3 paredes
- Organização automática dos ambientes
- Câmera com controle livre

⚠️ O 3D é **calculado em tempo real** — não é mock nem imagem fixa.

---

### 📄 Exportação de PDF (Checklist de Compra)

- Geração de PDF A4 profissional
- Tabela por produto:
  - área necessária
  - caixas
  - preço
  - total
- Observações importantes de obra
- Pronto para:
  - enviar no WhatsApp
  - imprimir
  - levar à loja

PDF gerado **sem dependência de CSS**, garantindo estabilidade.

---

### 📲 PWA (Aplicativo Instalável)

- Instalável no celular (Android e iOS)
- Funciona offline
- Ícone próprio
- Abre em tela cheia (standalone)
- Ideal para uso em obra ou loja

---

## 🧠 Inteligência do Sistema

- Reconhecimento automático de ambientes do tipo banheiro
- Ativação/desativação inteligente do box
- Prevenção de áreas negativas
- Arredondamento sempre para cima (caixas inteiras)
- Migração automática de dados antigos (schema versionado)

---

## 💾 Persistência de Dados

- Salvamento automático em cookies
- Dados mantidos ao fechar o navegador
- Estrutura preparada para versionamento

---

## 🎨 Interface

- Tailwind CSS
- daisyUI
- Design limpo, moderno e responsivo
- Otimizado para desktop e mobile

---

## 🧩 Stack Técnica

- Vue 3 (Composition API)
- Vite
- Pinia (estado global)
- Vue Router + Layouts
- Tailwind CSS + daisyUI
- Three.js (visualização 3D)
- jsPDF + autoTable (PDF)
- PWA (vite-plugin-pwa)

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Wizard.vue
│   ├── ProjetoForm.vue
│   ├── AmbientesEditor.vue
│   ├── ProdutosEditor.vue
│   ├── ResumoPorProduto.vue
│   ├── Projeto3D.vue
│   └── ExportarPdfButton.vue
│
├── services/
│   ├── cookieStorage.js
│   └── exportChecklistPdf.js
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

## 🗺️ Roadmap (Próximas Etapas)

- Texturas no 3D por produto
- Exportar imagem do projeto 3D
- Validações inteligentes (áreas sem produto)
- Múltiplos projetos (histórico / modo vendedor)
- Compartilhamento por link

---

## 👨‍💻 Autor

Projeto criado a partir de uma necessidade real de obra, evoluindo para uma ferramenta profissional de planejamento.

**Manel**

---

## 📄 Licença

Uso livre para fins educacionais e pessoais.

---

🚀 *Este projeto já resolve um problema real — e está pronto para evoluir ainda mais.*