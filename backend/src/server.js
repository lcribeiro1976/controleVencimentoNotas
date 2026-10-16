// Importa a biblioteca Express
const express = require('express');

const db = require('./db');

const { documentoValido, emailValido, somenteDigitos } = require('./validacoes');

// Cria uma instância do aplicativo Express
const app = express();

// Permite que a API aceite requisições com corpo em formato JSON
app.use(express.json());

// Valida e limpa os dados de um cliente.
// Devolve { erro } se algo estiver errado, ou { dados } com os dados prontos para gravar.
function validarCliente(body) {
  const nome = String(body.nome || '').trim();
  const documento = somenteDigitos(body.documento);
  const email = String(body.email || '').trim().toLowerCase();
  const telefone = String(body.telefone || '').trim();

  if (!nome) return { erro: 'O nome é obrigatório.' };
  if (!documentoValido(documento)) return { erro: 'CPF ou CNPJ inválido.' };
  if (!emailValido(email)) return { erro: 'E-mail inválido.' };
  if (!telefone) return { erro: 'O telefone é obrigatório.' };

  return { dados: { nome, documento, email, telefone } };
}

// Rotas da API
// Define uma rota GET para a raiz da API
app.get('/api/saude', (req, res) => {
  res.json({ ok: true, mensagem: 'Servidor funcionando' });
});

app.get('/api/hora', (req, res) => {
  const agora = new Date();
  const hora = agora.toLocaleTimeString('pt-BR');
  const data = agora.toLocaleDateString('pt-BR');
  res.json({ hora: hora, data: data });
});

app.get('/api/clientes', (req, res) => {
  const clientes = db.prepare('SELECT * FROM clientes ORDER BY nome').all();
  res.json(clientes);
});

// Nova rota: busca um cliente pelo id
app.get('/api/clientes/:id', (req, res) => {
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id)

  if(!cliente) {
    return res.status(404).json({erro: 'Cliente não encontrado'});
  }

  res.json(cliente);
  
});

// Cadastra um novo cliente
app.post('/api/clientes', (req, res) => {
  const { erro, dados } = validarCliente(req.body || {});
  if (erro) {
    return res.status(400).json({ erro });
  }

  try {
    const resultado = db
      .prepare('INSERT INTO clientes (nome, documento, email, telefone) VALUES (?, ?, ?, ?)')
      .run(dados.nome, dados.documento, dados.email, dados.telefone);

    const novo = db.prepare('SELECT * FROM clientes WHERE id = ?').get(resultado.lastInsertRowid);
    res.status(201).json(novo);
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      return res.status(409).json({ erro: 'Já existe um cliente com este documento ou e-mail.' });
    }
    throw e;
  }
});

// Edita um cliente existente
app.put('/api/clientes/:id', (req, res) => {
  const { erro, dados } = validarCliente(req.body || {});
  if (erro) {
    return res.status(400).json({ erro });
  }

  try {
    const resultado = db
      .prepare('UPDATE clientes SET nome = ?, documento = ?, email = ?, telefone = ? WHERE id = ?')
      .run(dados.nome, dados.documento, dados.email, dados.telefone, req.params.id);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    const atualizado = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
    res.json(atualizado);
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      return res.status(409).json({ erro: 'Já existe outro cliente com este documento ou e-mail.' });
    }
    throw e;
  }
});

// Apaga um cliente
app.delete('/api/clientes/:id', (req, res) => {
  const resultado = db.prepare('DELETE FROM clientes WHERE id = ?').run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }

  res.status(204).end();
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});