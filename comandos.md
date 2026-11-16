npm run dev



conectar o banco: node --watch src/server.js



link: http://localhost:3001/api/clientes



POST (INSERT): curl -i -X POST http://localhost:3001/api/clientes -H "Content-Type: application/json" -d '{"nome":"Carlos Mendes","documento":"77788899900","email":"carlos@email.com","telefone":"(34) 91111-2222"}'



GET (SELECT): curl -i http://localhost:3001/api/clientes/ID (NO ID -> substituir pelo número)



PUT (UPDATE): curl -i -X PUT http://localhost:3001/api/clientes/ID -H "Content-Type: application/json" -d '{"nome":"Melissa Costa Caetano","documento":"65665665656","email":"melcaetano@gmail.com","telefone":"(34) 97777-8888"}'



GET (SELECT): curl -i http://localhost:3001/api/clientes/ID (NO ID -> substituir pelo número)



DELETE (DELETE): curl -i -X DELETE http://localhost:3001/api/clientes/ID do cliente



GET (SELECT) -> curl -i http://localhost:3001/api/clientes/ID do cliente



=====================================================================

&#x20; COMANDOS DO PROJETO - CONTROLE DE VENCIMENTO DE NOTAS (TCC)

=====================================================================



ONDE RODAR CADA COISA

\---------------------

Terminal "bash backend"  ->  controleVencimentoNotas/backend

&#x20;   servidor, seed, node -e

Terminal "bash"          ->  controleVencimentoNotas

&#x20;   Git e curl





=====================================================================

1\. NAVEGAÇÃO NO TERMINAL (GIT BASH)

=====================================================================

pwd                  Mostra a pasta atual

ls                   Lista os arquivos da pasta

cd backend           Entra na pasta backend

cd ..                Volta uma pasta

mkdir -p a/b         Cria pastas (e as intermediárias)

code .               Abre a pasta atual no VS Code

Ctrl + C             Para o programa que está rodando (ex.: o servidor)

Seta para cima       Repete o último comando



=====================================================================

2\. NODE.JS E NPM  (rodar na pasta backend)

=====================================================================

node -v                      Mostra a versão do Node

npm init -y                  Cria o package.json (uma vez só)

npm install express@4        Instala o Express

npm install                  Instala tudo o que o package.json lista

node src/server.js           Liga o servidor

node --watch src/server.js   Liga o servidor e reinicia ao salvar

node src/db.js               Cria o banco e a tabela

node src/seed.js             Insere os clientes de exemplo

npx kill-port 3001           Desliga o programa que ocupa a porta 3001



Testar a validação de CPF direto no terminal:

node -e "const v = require('./src/validacoes'); console.log(v.cpfValido('11144477735'))"



=====================================================================

3\. CURL - TESTAR A API  (servidor ligado; qualquer pasta)

=====================================================================

Listar clientes:

curl -i http://localhost:3001/api/clientes



Ver um cliente (troque o 1 pelo id):

curl -i http://localhost:3001/api/clientes/1



Cadastrar:

curl -i -X POST http://localhost:3001/api/clientes -H "Content-Type: application/json" -d '{"nome":"Nome","documento":"11144477735","email":"nome@email.com","telefone":"(34) 90000-0000"}'



Editar (envie TODOS os campos):

curl -i -X PUT http://localhost:3001/api/clientes/1 -H "Content-Type: application/json" -d '{"nome":"Nome","documento":"11144477735","email":"nome@email.com","telefone":"(34) 91111-1111"}'



Apagar:

curl -i -X DELETE http://localhost:3001/api/clientes/1



Partes do comando:

\-i                                    Mostra o código da resposta (200, 201, 400...)

\-X POST                               Escolhe o método (sem -X é GET)

\-H "Content-Type: application/json"   Avisa que os dados estão em JSON

\-d '{...}'                            Os dados enviados, entre aspas simples



=====================================================================

4\. GIT  (rodar na pasta do projeto: controleVencimentoNotas)

=====================================================================

Configuração (uma vez só):

git --version                              Mostra a versão do Git

git config --global user.name "Nome"       Define o nome do autor

git config --global user.email "email"     Define o e-mail do autor

git config --global --list                 Mostra a configuração



Criar e ligar ao GitHub (uma vez só):

git init                                   Transforma a pasta em repositório

git branch -M main                         Renomeia o ramo para main

git remote add origin URL                  Liga o projeto ao GitHub

git remote set-url origin URL              Troca o endereço do GitHub

git remote -v                              Mostra o endereço configurado

git push -u origin main                    Primeiro envio para o GitHub



Dia a dia:

git status                                 Mostra o que mudou

git add .                                  Escolhe todas as mudanças

git commit -m "o que foi feito"            Grava um commit

git push                                   Envia para o GitHub

git log --oneline                          Lista o histórico de commits

git commit --amend -m "mensagem"           Substitui o último commit



Endereço do repositório:

https://github.com/lcribeiro1976/controleVencimentoNotas





=====================================================================

5\. SQL  (usado dentro do código)

=====================================================================

CREATE TABLE IF NOT EXISTS ...    Cria uma tabela, se não existir

INSERT INTO ... VALUES (...)      Adiciona uma linha

INSERT OR IGNORE INTO ...         Adiciona, pulando o que violar uma regra

SELECT \* FROM ...                 Lê linhas

... WHERE id = ?                  Filtra as linhas

... ORDER BY nome                 Ordena o resultado

UPDATE ... SET ... WHERE ...      Altera linhas  (NUNCA sem WHERE)

DELETE FROM ... WHERE ...         Apaga linhas   (NUNCA sem WHERE)



Regras de coluna:

PRIMARY KEY AUTOINCREMENT         Identificador numerado sozinho

NOT NULL                          Campo obrigatório

UNIQUE                            Valor não pode repetir



Métodos do node:sqlite:

db.exec(sql)                      Executa sem devolver nada (CREATE TABLE)

db.prepare(sql).all(...)          Devolve uma lista com todas as linhas

db.prepare(sql).get(...)          Devolve um objeto (ou undefined)

db.prepare(sql).run(...)          Devolve changes e lastInsertRowid





=====================================================================

6\. CÓDIGOS HTTP

=====================================================================

200 OK            Deu certo

201 Created       Algo foi criado (POST)

204 No Content    Deu certo, sem nada para devolver (DELETE)

400 Bad Request   Dado inválido ou faltando

404 Not Found     Registro não existe

409 Conflict      Dado repetido (CPF ou e-mail)

500 Internal      Erro não tratado no programa





=====================================================================

7\. ERROS COMUNS E SOLUÇÕES

=====================================================================

Cannot find module ...src/server.js

&#x20;   -> terminal na pasta errada: cd backend



EADDRINUSE: address already in use :::3001

&#x20;   -> outro servidor ligado: Ctrl + C nele, ou npx kill-port 3001



Could not connect to server (curl)

&#x20;   -> o servidor não está ligado



\[200\~curl: command not found

&#x20;   -> problema ao colar: bind 'set enable-bracketed-paste off'



UNIQUE constraint failed

&#x20;   -> dado repetido (CPF ou e-mail já cadastrado)



NOT NULL constraint failed

&#x20;   -> campo obrigatório faltando



Repository not found (git push)

&#x20;   -> o repositório ainda não foi criado no GitHub



Mudança no código não aparece

&#x20;   -> arquivo não salvo (Ctrl + S) ou servidor sem --watch

