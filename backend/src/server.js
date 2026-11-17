// Importa a biblioteca Express
const express = require('express');

const db = require('./db');

const { documentoValido, emailValido, somenteDigitos, dataValida, paraCentavos } = require('./validacoes');

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

// ---------- Notas ----------

// Valida e limpa os dados de uma nota
function validarNota(body) {
  const numero = String(body.numero || '').trim();
  const clienteId = Number(body.cliente_id);
  const descricao = String(body.descricao || '').trim() || null;
  const dataEmissao = body.data_emissao;
  const dataVencimento = body.data_vencimento;
  const valorCentavos = paraCentavos(body.valor);

  if (!numero) return { erro: 'O número da nota é obrigatório.' };
  if (!db.prepare('SELECT id FROM clientes WHERE id = ?').get(clienteId)) {
    return { erro: 'Cliente não encontrado.' };
  }
  if (!dataValida(dataEmissao)) return { erro: 'Data de emissão inválida (use AAAA-MM-DD).' };
  if (!dataValida(dataVencimento)) return { erro: 'Data de vencimento inválida (use AAAA-MM-DD).' };
  if (dataVencimento < dataEmissao) return { erro: 'O vencimento não pode ser antes da emissão.' };
  if (!(valorCentavos > 0)) return { erro: 'O valor deve ser maior que zero.' };

  return { dados: { numero, clienteId, descricao, dataEmissao, dataVencimento, valorCentavos } };
}

// Cadastra uma nova nota
app.post('/api/notas', (req, res) => {
  const { erro, dados } = validarNota(req.body || {});
  if (erro) {
    return res.status(400).json({ erro });
  }

  try {
    const resultado = db
      .prepare(`INSERT INTO notas (numero, cliente_id, descricao, data_emissao, data_vencimento, valor_centavos)
                VALUES (?, ?, ?, ?, ?, ?)`)
      .run(dados.numero, dados.clienteId, dados.descricao, dados.dataEmissao, dados.dataVencimento, dados.valorCentavos);

    const nova = db.prepare('SELECT * FROM notas WHERE id = ?').get(resultado.lastInsertRowid);
    res.status(201).json(nova);
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      return res.status(409).json({ erro: 'Já existe uma nota com este número.' });
    }
    throw e;
  }
});

app.get('/api/notas', (req, res) => {
  const notas = db.prepare(`
    SELECT n.*, c.nome AS cliente_nome,
      CAST(julianday(n.data_vencimento) - julianday(date('now', 'localtime')) AS INTEGER) AS dias_para_vencer,
      CASE
        WHEN n.cancelada = 1 THEN 'cancelada'
        WHEN n.data_vencimento < date('now', 'localtime') THEN 'vencida'
        WHEN n.data_vencimento <= date('now', 'localtime', '+7 days') THEN 'a_vencer'
        ELSE 'em_aberto'
      END AS status
    FROM notas n
    JOIN clientes c ON c.id = n.cliente_id
    ORDER BY n.data_vencimento
  `).all();
  res.json(notas);
});

app.patch('/api/notas/:id/cancelar', (req, res) => {
  const resultado = db.prepare('UPDATE notas SET cancelada = 1 WHERE id = ?').run(req.params.id);
  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Nota não encontrada.' });
  }
  res.json(db.prepare('SELECT * FROM notas WHERE id = ?').get(req.params.id));
});

// Inicia o servidor na porta 3001
app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});