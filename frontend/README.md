# Frontend - Sistema de Gerenciamento de Filmes

Este é o frontend React para o sistema de gerenciamento de filmes que consome a API Django.

## Funcionalidades

- **Autenticação**: Login com JWT
- **Dashboard**: Estatísticas gerais do sistema
- **CRUD Completo**:
  - Gêneros
  - Atores
  - Filmes
  - Avaliações

## Tecnologias Utilizadas

- React 18 com TypeScript
- React Router DOM para navegação
- Axios para requisições HTTP
- Tailwind CSS para estilização
- Lucide React para ícones
- Context API para gerenciamento de estado

## Como Executar

1. Certifique-se de que a API Django está rodando em `http://localhost:8000`

2. Instale as dependências:
```bash
cd frontend
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse `http://localhost:5173`

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Context API (AuthContext)
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── types/              # Definições de tipos TypeScript
└── App.tsx             # Componente principal
```

## Credenciais de Teste

Para testar o sistema, você precisará criar um superusuário no Django:

```bash
python manage.py createsuperuser
```

## Funcionalidades por Página

### Dashboard
- Estatísticas gerais (total de filmes, avaliações, média de estrelas)
- Gráfico de filmes por gênero

### Gêneros
- Listar todos os gêneros
- Criar novo gênero
- Editar gênero existente
- Excluir gênero

### Atores
- Listar todos os atores
- Criar novo ator (nome, data de nascimento, nacionalidade)
- Editar ator existente
- Excluir ator

### Filmes
- Listar todos os filmes em cards
- Criar novo filme (título, gênero, atores, data de lançamento, resumo)
- Editar filme existente
- Excluir filme
- Visualizar avaliação média

### Avaliações
- Listar todas as avaliações
- Criar nova avaliação (filme, estrelas, comentário)
- Editar avaliação existente
- Excluir avaliação
- Sistema de estrelas interativo