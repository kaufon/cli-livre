## Como Executar Localmente no Windows 🖥️

### Pré-requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado em sua máquina Windows:

1. **Node.js(v18.17.0 ou acima)**: Baixe e instale o Node.js a partir de [nodejs.org](https://nodejs.org/). Isso também instalará o npm (Node Package Manager).
2. **Git**: Baixe e instale o Git a partir de [git-scm.com](https://git-scm.com/).
3. **Docker Compose**: Baixe e instale o Docker Compose a partir de [docker.com](https://docs.docker.com/compose/install/).


### Passo 1: Clonar o Repositório

Abra o seu prompt de comando (cmd) ou PowerShell e execute o seguinte comando para clonar o repositório:

```bash
git clone  https://github.com/kaufon/cli-livre.git
```

### Passo 2: Navegar até o Diretório do Projeto

Mude para o diretório do projeto:

```bash
cd cli-livre/
```

### Passo 3: Instalar Dependências

Execute o seguinte comando para instalar as dependências necessárias:

```bash
npm install
```
### Passo 4: Execute o container

```bash
docker compose up
```
### Passo 5: Execute o projeto

```bash
npm run dev
```
