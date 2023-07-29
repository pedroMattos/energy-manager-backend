
# Desafio Fullstack (backend)

Projeto simples de um scrap de pdfs préviamente inseridos numa pasta em Nodejs e com dados persistidos em um banco de dados Postgresql.


## Funcionalidades

- Ler o pdf das faturas
- Extrair dados necessários com expressões regulares
- Criar tabelas caso não existam
- Salvar os dados das faturas
- Servir os endpoints para serem consumidos


## Variáveis de Ambiente Backend

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PORT` defina a porta do node

`FILES_FOLDER_NAME` Pasta onde deve ser inseridas as faturas que serão lidas

`USER` usuário do banco postgresql

`HOST` host do banco postgresql, caso seja local (127.0.0.1)

`DATABASE` nome do banco de dados


## Instalação

Instalação do banco

https://www.postgresql.org/download/windows/

Instalação Node.js

https://nodejs.org/en

## Instalar dependências e iniciar

```bash
    npm install; npm run start
```


    
## Rodando os testes e2e

Para rodar os testes e2e, rode o seguinte comando

```bash
  npm run test
```


## Stack utilizada

Node, Express, Postgresql, Puppeteer, Jest, Knexjs

