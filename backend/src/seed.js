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

const inserirNota = db.prepare(`
  INSERT OR IGNORE INTO notas
    (numero, cliente_id, descricao, data_emissao, data_vencimento, valor_centavos, cancelada)
  VALUES (?, ?, ?, date('now', 'localtime', ?), date('now', 'localtime', ?), ?, ?)
`);

// [numero, cliente_id, descricao, emissão, vencimento, valor em centavos, cancelada]
const notas = [
  ['NF-001', 1, 'Consultoria mensal',  '-40 days', '-10 days', 150000, 0], // vencida
  ['NF-002', 2, 'Equipamentos',        '-15 days', '+3 days',  123456, 0], // a vencer
  ['NF-003', 3, 'Manutenção',          '-5 days',  '+25 days',  48000, 0], // em aberto
  ['NF-004', 6, 'Sistema de caixa',    '-20 days', '+5 days',   89990, 0], // a vencer
  ['NF-005', 7, 'Treinamento',         '-60 days', '-30 days',  72000, 0], // vencida
  ['NF-006', 4, 'Serviço cancelado',   '-10 days', '+20 days',  30000, 1], // cancelada
];

for (const nota of notas) inserirNota.run(...nota);

console.log('Notas de exemplo inseridas.');

console.log(`${clientes.length} clientes de exemplo processados.`);