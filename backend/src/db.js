// Módulo do Node para montar caminhos de arquivos
const path = require('node:path');

// Carrega o SQLite que já vem embutido no Node
const { DatabaseSync } = require('node:sqlite');

// Monta o caminho do banco a partir da pasta deste arquivo (src),
// subindo um nível: o banco fica sempre em backend/banco.sqlite
const caminhoBanco = path.join(__dirname, '..', 'banco.sqlite');

// Abre o arquivo do banco (se não existir, ele é criado)
const db = new DatabaseSync(caminhoBanco);

// Cria a tabela de clientes, caso ainda não exista
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL,
    documento TEXT NOT NULL UNIQUE,
    email     TEXT NOT NULL UNIQUE,
    telefone  TEXT NOT NULL
  )
`);

// Disponibiliza o banco para os outros arquivos
module.exports = db;