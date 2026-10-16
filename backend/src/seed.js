// Popula o banco com clientes de exemplo (dados fictícios, documentos válidos)
const db = require('./db');

const inserir = db.prepare(
  'INSERT OR IGNORE INTO clientes (nome, documento, email, telefone) VALUES (?, ?, ?, ?)'
);

// Cada item da lista é um cliente: [nome, documento, email, telefone]
const clientes = [
  ['Ana Souza Lima',          '11144477735',    'ana.souza@email.com',     '(34) 98888-0000'],
  ['Bruno Teixeira',          '52998224725',    'bruno.teixeira@email.com','(34) 91234-5678'],
  ['Carla Mendes',            '12345678909',    'carla.mendes@email.com',  '(34) 99876-5432'],
  ['Diego Ramos',             '98765432100',    'diego.ramos@email.com',   '(34) 98765-1234'],
  ['Elisa Nogueira',          '24681357928',    'elisa.nogueira@email.com','(34) 99123-4567'],
  ['Padaria Pão Quente Ltda', '12345678000195', 'contato@paoquente.com',   '(34) 3222-1100'],
  ['Mercado Bom Dia Ltda',    '11222333000181', 'contato@bomdia.com',      '(34) 3333-4444'],
];

// Insere um cliente por vez
for (const cliente of clientes) {
  inserir.run(...cliente);
}

console.log(`${clientes.length} clientes de exemplo processados.`);