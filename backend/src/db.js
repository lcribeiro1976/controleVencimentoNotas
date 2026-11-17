// Módulo do Node para montar caminhos de arquivos
const path = require('node:path');

// Carrega o SQLite que já vem embutido no Node
const { DatabaseSync } = require('node:sqlite');

// Monta o caminho do banco a partir da pasta deste arquivo (src),
// subindo um nível: o banco fica sempre em backend/banco.sqlite
const caminhoBanco = path.join(__dirname, '..', 'banco.sqlite');

// Abre o arquivo do banco (se não existir, ele é criado)
const db = new DatabaseSync(caminhoBanco);

// Liga a verificação de chaves estrangeiras (no SQLite ela vem desligada)
db.exec('PRAGMA foreign_keys = ON;');

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

// Cria a tabela de notas, ligada à tabela de clientes
db.exec(`
  CREATE TABLE IF NOT EXISTS notas (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    numero           TEXT    NOT NULL UNIQUE,
    cliente_id       INTEGER NOT NULL REFERENCES clientes(id),
    descricao        TEXT,
    data_emissao     TEXT    NOT NULL,
    data_vencimento  TEXT    NOT NULL,
    valor_centavos   INTEGER NOT NULL CHECK (valor_centavos > 0),
    cancelada        INTEGER NOT NULL DEFAULT 0,
    CHECK (data_vencimento >= data_emissao)
  )
`);

// Disponibiliza o banco para os outros arquivos
module.exports = db;