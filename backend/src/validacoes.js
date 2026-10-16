// Funções de validação de dados.

// Remove todos os caracteres que não sejam dígitos
function somenteDigitos(texto) {
  return String(texto || '').replace(/\D/g, '');
}

// Valida um CPF pelos dois dígitos verificadores
function cpfValido(cpf) {
  const d = somenteDigitos(cpf);

  // Precisa ter 11 dígitos e não pode ser uma sequência de números iguais
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  // 1º dígito verificador: multiplica os 9 primeiros por 10, 9, 8 ... 2
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(d[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(d[9])) return false;

  // 2º dígito verificador: multiplica os 10 primeiros por 11, 10, 9 ... 2
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(d[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  return resto === Number(d[10]);
}

// Valida um CNPJ pelos dois dígitos verificadores
function cnpjValido(cnpj) {
  const d = somenteDigitos(cnpj);

  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;

  // Calcula um dígito verificador a partir de uma base e de uma lista de pesos
  function calcularDigito(base, pesos) {
    let soma = 0;
    for (let i = 0; i < pesos.length; i++) {
      soma += Number(base[i]) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  const digito1 = calcularDigito(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digito2 = calcularDigito(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return digito1 === Number(d[12]) && digito2 === Number(d[13]);
}

// Aceita CPF (11 dígitos) ou CNPJ (14 dígitos)
function documentoValido(documento) {
  const d = somenteDigitos(documento);
  if (d.length === 11) return cpfValido(d);
  if (d.length === 14) return cnpjValido(d);
  return false;
}

// Valida um e-mail com uma expressão regular simples
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

module.exports = { somenteDigitos, cpfValido, cnpjValido, documentoValido, emailValido };