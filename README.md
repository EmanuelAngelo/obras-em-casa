# 🏠 Obras em Casa

Aplicação frontend desenvolvida em **Vue 3 + Vuetify** para auxiliar no **cálculo de compra de pisos e revestimentos** (chão e parede), permitindo ao usuário planejar sua obra sem perder dados, mesmo ao fechar o navegador.

Todos os dados são **salvos automaticamente em cookies**, sem necessidade de backend nesta primeira fase.

---

## 🎯 Objetivo do Projeto

Resolver uma dor comum durante obras:

> *“Tenho os metros quadrados da minha casa, vejo o preço do piso na loja, mas não sei quantas caixas comprar.”*

O **Obras em Casa** permite:
- Criar um projeto de obra
- Cadastrar ambientes (sala, cozinha, quartos, banheiro, etc.)
- Definir se o revestimento será apenas no chão ou também na parede
- Calcular área total
- Estimar quantidade de caixas considerando perda

---

## 🧱 Funcionalidades Atuais (MVP)

### 📁 Projeto
- Nome do projeto
- Data de criação automática
- Reset completo dos dados

### 🏠 Ambientes
- Cadastro de múltiplos ambientes
- Tipos:
  - Chão
  - Parede
- Área em m² por ambiente
- Edição e remoção

### 🧩 Revestimentos
- Piso (chão)
- Revestimento de parede
- Informações configuráveis:
  - Nome / modelo
  - Dimensão da peça (cm)
  - m² por caixa
  - Peças por caixa
  - Percentual de perda

### 📊 Resumo
- Área total de chão
- Área total de parede
- Estimativa automática de caixas
- Cálculo considerando percentual de perda

### 💾 Persistência
- Salvamento automático em **cookies**
- Dados persistem ao recarregar ou fechar o navegador

---

## 🛠️ Tecnologias Utilizadas

- **Vue 3** (Composition API)
- **Vuetify 3** (UI Components)
- **Pinia** (Gerenciamento de estado)
- **Vue Router**
- **js-cookie** (Persistência local)
- **Vite** (Build e Dev Server)

---

## 📁 Estrutura do Projeto

```
obras-em-casa/
├── src/
│   ├── components/
│   │   ├── ProjetoForm.vue
│   │   ├── AmbientesEditor.vue
│   │   ├── RevestimentosEditor.vue
│   │   ├── RevestimentoCard.vue
│   │   └── ResumoCompra.vue
│   ├── models/
│   │   └── defaults.js
│   ├── services/
│   │   └── cookieStorage.js
│   ├── stores/
│   │   └── app.store.js
│   ├── views/
│   │   └── HomeView.vue
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── public/
├── package.json
└── README.md
```

---

## ▶️ Como Rodar o Projeto

### 1️⃣ Criar o projeto
```bash
npm create vuetify@latest obras-em-casa
cd obras-em-casa
```

### 2️⃣ Instalar dependências
```bash
npm install
npm install js-cookie
```

### 3️⃣ Rodar em modo desenvolvimento
```bash
npm run dev
```

Acesse:
```
http://localhost:5173
```

---

## 🔀 Router

O projeto utiliza **router-view** como tela principal.

Rota padrão:
```js
{
  path: '/',
  name: 'home',
  component: HomeView
}
```

---

## 🧠 Gerenciamento de Estado

O estado global é controlado pelo **Pinia**:

- Projeto
- Ambientes
- Revestimentos

Toda alteração dispara salvamento automático em cookies.

---

## 🔒 Persistência em Cookies

- Biblioteca: `js-cookie`
- Duração: **30 dias**
- Chave usada:
```txt
obras_em_casa_state
```

Funções principais:
- `loadState()`
- `saveState(state)`
- `clearState()`

---

## 🚧 Próximas Evoluções Planejadas

- Cálculo de parede por **altura (até X metros)**
- Cálculo automático por **dimensão da peça**
- Templates de ambientes prontos
- Modo wizard (passo a passo)
- Exportação para **PDF / checklist de compra**
- Backend futuro (API em Python / Django)

---

## 👨‍💻 Autor

Projeto idealizado e desenvolvido para resolver uma dor real em obras residenciais.

**Nome:** Manel

---

## 📄 Licença

Uso livre para fins educacionais e pessoais.

---

🚀 *Projeto em evolução contínua.*

