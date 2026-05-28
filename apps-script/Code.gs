const SPREADSHEET_ID = '15vvhb0nWCFuaCoeYZXeXXH8mZuiTSfIZZxX6BKwQtFU';

const HEADER_ROW = 4;
const DATA_START_ROW = HEADER_ROW + 1;

const SHEET_ALIASES = {
  clientes: ['clientes'],
  orcamentos: ['orcamentos'],
  vendas: ['vendas'],
  financeiro: ['financeiro', 'financeiros'],
  lembretes: ['lembretes', 'lembrete'],
  logs: ['logs']
};

const HEADERS = {
  clientes: ['dataHora', 'nome', 'telefone', 'email', 'empresa', 'cpfCNPJ', 'obs'],
  orcamentos: ['numero', 'dataHora', 'cliente', 'produtoServico', 'descricao', 'validade', 'obsPublic', 'obsPrivate', 'custoMaterial', 'custoOutros', 'totalCustos', 'lucro', 'margem', 'valorTotal', 'itensJson', 'status'],
  vendas: ['numero', 'dataHora', 'cliente', 'produtoServico', 'descricao', 'valor', 'valorRecebido', 'saldoRestante', 'statusRecebimento', 'vencimento', 'totalCustos', 'lucro', 'margem', 'pgto', 'itensJson', 'pagamentosJson', 'obs'],
  financeiro: ['numero', 'dataHora', 'tipo', 'categoria', 'descricao', 'valor', 'status', 'vencimento', 'origem', 'referencia', 'obs'],
  lembretes: ['numero', 'dataHora', 'titulo', 'descricao', 'vencimento', 'status', 'origem', 'obs'],
  logs: ['user', 'perfil', 'dataHora', 'sistema', 'navegador', 'ip']
};

const LEGACY_HEADERS = {
  orcamentos: ['numero', 'dataHora', 'cliente', 'produtoServico', 'descricao', 'validade', 'obsPublic', 'obsPrivate', 'custoMaterial', 'custoOutros', 'totalCustos', 'lucro', 'margem', 'status'],
  vendas: ['numero', 'dataHora', 'cliente', 'produtoServico', 'descricao', 'valor', 'totalCustos', 'lucro', 'margem', 'pgto', 'obs']
};

const CODE_PREFIX = {
  orcamentos: 'ORC',
  vendas: 'VEN',
  financeiro: 'FIN',
  lembretes: 'LEM'
};

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const payload = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = payload.action || (e && e.parameter && e.parameter.action) || '';
    let data = payload.payload || {};
    if (!payload.payload && e && e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    }
    const response = dispatch_(action, data || {});
    return output_({ ok: true, data: response }, e);
  } catch (error) {
    return output_({ ok: false, error: error.message || String(error) }, e);
  }
}

function dispatch_(action, data) {
  switch (action) {
    case 'listAll':
      return {
        clientes: listTable_('clientes'),
        orcamentos: listTable_('orcamentos'),
        vendas: listTable_('vendas'),
        financeiro: listTable_('financeiro'),
        lembretes: listTable_('lembretes'),
        logs: listTable_('logs')
      };
    case 'createCliente':
      return createCliente_(data);
    case 'createOrcamento':
      return createOrcamento_(data);
    case 'updateOrcamento':
      return updateOrcamento_(data);
    case 'createVenda':
      return createVenda_(data);
    case 'updateVenda':
      return updateVenda_(data);
    case 'createFinanceiro':
      return createFinanceiro_(data);
    case 'updateFinanceiro':
      return updateFinanceiro_(data);
    case 'createLembrete':
      return createLembrete_(data);
    case 'updateLembrete':
      return updateLembrete_(data);
    case 'logLogin':
      return logLogin_(data);
    default:
      throw new Error('Acao invalida.');
  }
}

function output_(payload, e) {
  const text = JSON.stringify(payload);
  const callback = e && e.parameter && e.parameter.callback;
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + text + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

function createCliente_(data) {
  const payload = {
    dataHora: normalizeDateValue_(data.dataHora) || now_(),
    nome: stringValue_(data.nome),
    telefone: stringValue_(data.telefone),
    email: stringValue_(data.email),
    empresa: stringValue_(data.empresa),
    cpfCNPJ: stringValue_(data.cpfCNPJ),
    obs: stringValue_(data.obs)
  };
  return appendRow_('clientes', payload);
}

function createOrcamento_(data) {
  const payload = normalizeOrcamentoPayload_(data);
  if (!payload.numero) {
    payload.numero = nextCode_('orcamentos', CODE_PREFIX.orcamentos);
  }
  return appendRow_('orcamentos', payload);
}

function updateOrcamento_(data) {
  const payload = normalizeOrcamentoPayload_(data);
  payload.rowIndex = Number(data.rowIndex || payload.rowIndex);
  if (!payload.rowIndex) throw new Error('rowIndex obrigatorio');
  writeRowData_('orcamentos', payload.rowIndex, payload);
  return payload;
}

function createVenda_(data) {
  const payload = normalizeVendaPayload_(data);
  if (!payload.numero) {
    payload.numero = nextCode_('vendas', CODE_PREFIX.vendas);
  }
  const venda = appendRow_('vendas', payload);
  syncFinanceFromVenda_(venda);
  return venda;
}

function updateVenda_(data) {
  const payload = normalizeVendaPayload_(data);
  payload.rowIndex = Number(data.rowIndex || payload.rowIndex);
  if (!payload.rowIndex) throw new Error('rowIndex obrigatorio');
  writeRowData_('vendas', payload.rowIndex, payload);
  syncFinanceFromVenda_(payload);
  return payload;
}

function createFinanceiro_(data) {
  const payload = normalizeFinancePayload_(data);
  if (!payload.numero) {
    payload.numero = nextCode_('financeiro', CODE_PREFIX.financeiro);
  }
  return appendRow_('financeiro', payload);
}

function updateFinanceiro_(data) {
  const existing = getRecordByRowIndex_('financeiro', Number(data.rowIndex));
  if (!existing) throw new Error('Lancamento financeiro nao encontrado.');
  const payload = normalizeFinancePayload_(mergeObjects_(existing, data));
  payload.rowIndex = Number(data.rowIndex || existing.rowIndex);
  if (!payload.rowIndex) throw new Error('rowIndex obrigatorio');
  writeRowData_('financeiro', payload.rowIndex, payload);
  if (stringValue_(payload.origem).toLowerCase() === 'venda') {
    syncVendaFromFinance_(referenceBase_(payload.referencia));
  }
  return payload;
}

function createLembrete_(data) {
  const payload = normalizeLembretePayload_(data);
  if (!payload.numero) {
    payload.numero = nextCode_('lembretes', CODE_PREFIX.lembretes);
  }
  return appendRow_('lembretes', payload);
}

function updateLembrete_(data) {
  const payload = normalizeLembretePayload_(data);
  payload.rowIndex = Number(data.rowIndex || payload.rowIndex);
  if (!payload.rowIndex) throw new Error('rowIndex obrigatorio');
  writeRowData_('lembretes', payload.rowIndex, payload);
  return payload;
}

function logLogin_(data) {
  const payload = {
    user: stringValue_(data.user),
    perfil: stringValue_(data.perfil),
    dataHora: normalizeDateValue_(data.dataHora) || now_(),
    sistema: stringValue_(data.sistema),
    navegador: stringValue_(data.navegador),
    ip: stringValue_(data.ip)
  };
  return appendRow_('logs', payload);
}

function syncFinanceFromVenda_(venda) {
  const vendaNumero = stringValue_(venda.numero);
  if (!vendaNumero) return;

  const pagamentos = getVendaPayments_(venda);
  const existingFinanceRows = listFinanceByVenda_(vendaNumero);
  const existingByReference = {};
  for (var i = 0; i < existingFinanceRows.length; i += 1) {
    existingByReference[stringValue_(existingFinanceRows[i].referencia)] = existingFinanceRows[i];
  }

  const financeSheet = getSheet_('financeiro');
  deleteRowsByIndexes_(financeSheet, existingFinanceRows.map(function (row) {
    return row.rowIndex;
  }));

  for (var j = 0; j < pagamentos.length; j += 1) {
    const payment = pagamentos[j];
    const paymentId = stringValue_(payment.id) || makeId_('pay');
    const reference = vendaNumero + '::' + paymentId;
    const existing = existingByReference[reference] || null;
    const financePayload = normalizeFinancePayload_({
      numero: existing && existing.numero ? existing.numero : '',
      dataHora: payment.status === 'Pago'
        ? normalizeDateValue_(payment.recebidoEm) || normalizeDateValue_(venda.dataHora) || now_()
        : normalizeDateValue_(venda.dataHora) || now_(),
      tipo: 'Entrada',
      categoria: normalizePaymentMethod_(payment.forma),
      descricao: buildVendaFinanceDescription_(venda, payment, j),
      valor: roundCurrency_(payment.valor),
      status: payment.status === 'Pago' ? 'Pago' : 'A pagar',
      vencimento: payment.status === 'Pago'
        ? normalizeDateValue_(payment.recebidoEm || payment.vencimento || venda.vencimento)
        : normalizeDateValue_(payment.vencimento || venda.vencimento),
      origem: 'Venda',
      referencia: reference,
      obs: stringValue_(venda.obs || venda.cliente)
    });
    if (!financePayload.numero) {
      financePayload.numero = nextCode_('financeiro', CODE_PREFIX.financeiro);
    }
    appendRow_('financeiro', financePayload);
  }
}

function syncVendaFromFinance_(vendaNumero) {
  const numero = stringValue_(vendaNumero);
  if (!numero) return null;

  const venda = findRecordByField_('vendas', 'numero', numero);
  if (!venda) return null;

  const financeRows = listFinanceByVenda_(numero);
  const payments = getVendaPayments_(venda);
  const paymentById = {};
  for (var i = 0; i < payments.length; i += 1) {
    paymentById[stringValue_(payments[i].id)] = payments[i];
  }

  for (var j = 0; j < financeRows.length; j += 1) {
    const financeRow = financeRows[j];
    const paymentId = paymentIdFromReference_(financeRow.referencia) || makeId_('pay');
    const payment = paymentById[paymentId] || normalizePayment_({
      id: paymentId,
      descricao: financeRow.descricao,
      valor: financeRow.valor,
      forma: financeRow.categoria,
      status: financeStatusToPaymentStatus_(financeRow.status),
      vencimento: financeRow.vencimento,
      recebidoEm: financeStatusToPaymentStatus_(financeRow.status) === 'Pago' ? financeRow.dataHora : ''
    }, j);
    payment.id = paymentId;
    payment.descricao = payment.descricao || financeRow.descricao || ('Parcela ' + (j + 1));
    payment.valor = roundCurrency_(financeRow.valor);
    payment.forma = normalizePaymentMethod_(financeRow.categoria || payment.forma);
    payment.status = financeStatusToPaymentStatus_(financeRow.status);
    payment.vencimento = normalizeDateValue_(financeRow.vencimento || payment.vencimento);
    payment.recebidoEm = payment.status === 'Pago'
      ? normalizeDateValue_(financeRow.dataHora || payment.recebidoEm) || now_()
      : '';
    paymentById[paymentId] = payment;
  }

  const syncedPayments = Object.keys(paymentById).map(function (key) {
    return paymentById[key];
  }).sort(function (a, b) {
    return stringValue_(a.id).localeCompare(stringValue_(b.id));
  });

  const normalizedVenda = normalizeVendaPayload_(mergeObjects_(venda, {
    pagamentosJson: JSON.stringify(syncedPayments)
  }));
  normalizedVenda.rowIndex = Number(venda.rowIndex);
  writeRowData_('vendas', normalizedVenda.rowIndex, normalizedVenda);
  return normalizedVenda;
}

function listFinanceByVenda_(vendaNumero) {
  const numero = stringValue_(vendaNumero);
  if (!numero) return [];
  return listTable_('financeiro').filter(function (row) {
    return stringValue_(row.origem).toLowerCase() === 'venda' && referenceBase_(row.referencia) === numero;
  });
}

function normalizeOrcamentoPayload_(data) {
  const items = getOrcamentoItems_(data);
  const totals = calcItemTotals_(items, data.custoOutros);
  const valorTotal = hasValue_(data.valorTotal) ? roundCurrency_(data.valorTotal) : totals.valorTotal;
  const totalCustos = hasValue_(data.totalCustos) ? roundCurrency_(data.totalCustos) : totals.totalCustos;
  const lucro = hasValue_(data.lucro) ? roundCurrency_(data.lucro) : roundCurrency_(valorTotal - totalCustos);
  const margem = hasValue_(data.margem) ? Number(data.margem) : (valorTotal ? (lucro / valorTotal) * 100 : 0);
  return {
    numero: stringValue_(data.numero),
    dataHora: normalizeDateValue_(data.dataHora) || now_(),
    cliente: stringValue_(data.cliente),
    produtoServico: stringValue_(data.produtoServico || summarizeItems_(items, 'Itens do orcamento')),
    descricao: stringValue_(data.descricao || describeItems_(items)),
    validade: normalizeDateValue_(data.validade),
    obsPublic: stringValue_(data.obsPublic),
    obsPrivate: stringValue_(data.obsPrivate),
    custoMaterial: hasValue_(data.custoMaterial) ? roundCurrency_(data.custoMaterial) : totals.custoItens,
    custoOutros: totals.custoOutros,
    totalCustos: totalCustos,
    lucro: lucro,
    margem: margem,
    valorTotal: valorTotal,
    itensJson: JSON.stringify(items),
    status: stringValue_(data.status || 'Em negociacao')
  };
}

function normalizeVendaPayload_(data) {
  const items = getVendaItems_(data);
  const itemTotals = calcItemTotals_(items, 0);
  const valor = hasValue_(data.valor) ? roundCurrency_(data.valor) : itemTotals.valorTotal;
  const pagamentos = finalizePayments_(getVendaPayments_(data), data.dataHora || now_(), data.vencimento);
  const paymentSummary = calcPaymentSummary_(pagamentos, valor);
  const totalCustos = hasValue_(data.totalCustos) ? roundCurrency_(data.totalCustos) : itemTotals.totalCustos;
  const lucro = hasValue_(data.lucro) ? roundCurrency_(data.lucro) : roundCurrency_(valor - totalCustos);
  const margem = hasValue_(data.margem) ? Number(data.margem) : (valor ? (lucro / valor) * 100 : 0);
  return {
    numero: stringValue_(data.numero),
    dataHora: normalizeDateValue_(data.dataHora) || now_(),
    cliente: stringValue_(data.cliente),
    produtoServico: stringValue_(data.produtoServico || summarizeItems_(items, 'Itens da venda')),
    descricao: stringValue_(data.descricao || describeItems_(items)),
    valor: valor,
    valorRecebido: paymentSummary.recebido,
    saldoRestante: paymentSummary.saldo,
    statusRecebimento: paymentSummary.status,
    vencimento: paymentSummary.proximoVencimento,
    totalCustos: totalCustos,
    lucro: lucro,
    margem: margem,
    pgto: paymentSummary.pgto,
    itensJson: JSON.stringify(items),
    pagamentosJson: JSON.stringify(pagamentos),
    obs: stringValue_(data.obs)
  };
}

function normalizeFinancePayload_(data) {
  const tipo = stringValue_(data.tipo || 'Entrada');
  const status = stringValue_(data.status || (tipo.toLowerCase() === 'saida' ? 'A pagar' : 'Pago'));
  return {
    numero: stringValue_(data.numero),
    dataHora: normalizeDateValue_(data.dataHora) || now_(),
    tipo: tipo,
    categoria: stringValue_(data.categoria || (tipo.toLowerCase() === 'saida' ? 'Compra de material' : 'Aporte')),
    descricao: stringValue_(data.descricao),
    valor: roundCurrency_(data.valor),
    status: status,
    vencimento: normalizeDateValue_(data.vencimento),
    origem: stringValue_(data.origem || 'Manual'),
    referencia: stringValue_(data.referencia),
    obs: stringValue_(data.obs)
  };
}

function normalizeLembretePayload_(data) {
  return {
    numero: stringValue_(data.numero),
    dataHora: normalizeDateValue_(data.dataHora) || now_(),
    titulo: stringValue_(data.titulo),
    descricao: stringValue_(data.descricao),
    vencimento: normalizeDateValue_(data.vencimento),
    status: stringValue_(data.status || 'Pendente'),
    origem: stringValue_(data.origem || 'Manual'),
    obs: stringValue_(data.obs)
  };
}

function getOrcamentoItems_(data) {
  const parsed = parseJsonArray_(data.itensJson);
  if (parsed.length) {
    return parsed.map(function (item, index) {
      return normalizeItem_(item, index);
    });
  }
  const valor = hasValue_(data.valorTotal)
    ? roundCurrency_(data.valorTotal)
    : roundCurrency_(toNumber_(data.totalCustos) + toNumber_(data.lucro));
  const custo = hasValue_(data.custoMaterial)
    ? roundCurrency_(data.custoMaterial)
    : roundCurrency_(Math.max(toNumber_(data.totalCustos) - toNumber_(data.custoOutros), 0));
  if (!stringValue_(data.produtoServico) && !stringValue_(data.descricao) && !valor) {
    return [];
  }
  return [normalizeItem_({
    id: makeId_('item'),
    tipo: 'Produto',
    titulo: stringValue_(data.produtoServico || 'Item unico'),
    descricao: stringValue_(data.descricao),
    quantidade: 1,
    valorUnitario: valor,
    custoUnitario: custo
  }, 0)];
}

function getVendaItems_(data) {
  const parsed = parseJsonArray_(data.itensJson);
  if (parsed.length) {
    return parsed.map(function (item, index) {
      return normalizeItem_(item, index);
    });
  }
  const valor = roundCurrency_(data.valor);
  const custo = roundCurrency_(data.totalCustos);
  if (!stringValue_(data.produtoServico) && !stringValue_(data.descricao) && !valor) {
    return [];
  }
  return [normalizeItem_({
    id: makeId_('item'),
    tipo: 'Produto',
    titulo: stringValue_(data.produtoServico || 'Item unico'),
    descricao: stringValue_(data.descricao),
    quantidade: 1,
    valorUnitario: valor,
    custoUnitario: custo
  }, 0)];
}

function getVendaPayments_(data) {
  const parsed = parseJsonArray_(data.pagamentosJson);
  if (parsed.length) {
    return parsed.map(function (payment, index) {
      return normalizePayment_(payment, index);
    }).filter(function (payment) {
      return payment.valor > 0;
    });
  }

  const total = roundCurrency_(data.valor);
  if (!total) return [];

  const metodo = normalizePaymentMethod_(data.pgto);
  const hasRecebido = hasValue_(data.valorRecebido);
  const hasSaldo = hasValue_(data.saldoRestante);
  const valorRecebido = roundCurrency_(hasRecebido ? data.valorRecebido : total);
  const saldoRestante = roundCurrency_(hasSaldo ? data.saldoRestante : Math.max(total - valorRecebido, 0));
  const pagamentos = [];

  if (valorRecebido > 0) {
    pagamentos.push(normalizePayment_({
      id: makeId_('pay'),
      descricao: 'Recebimento principal',
      valor: valorRecebido,
      forma: metodo,
      status: 'Pago',
      recebidoEm: data.dataHora || now_()
    }, pagamentos.length));
  }

  if (saldoRestante > 0) {
    pagamentos.push(normalizePayment_({
      id: makeId_('pay'),
      descricao: 'Saldo restante',
      valor: saldoRestante,
      forma: metodo,
      status: 'Pendente',
      vencimento: data.vencimento || ''
    }, pagamentos.length));
  }

  if (!pagamentos.length) {
    pagamentos.push(normalizePayment_({
      id: makeId_('pay'),
      descricao: 'Pagamento integral',
      valor: total,
      forma: metodo,
      status: 'Pago',
      recebidoEm: data.dataHora || now_()
    }, 0));
  }

  return pagamentos;
}

function normalizeItem_(item, index) {
  const quantidade = Math.max(toNumber_(item.quantidade) || 1, 0.01);
  const valorUnitario = hasValue_(item.valorUnitario) ? roundCurrency_(item.valorUnitario) : roundCurrency_(item.valor);
  return {
    id: stringValue_(item.id || makeId_('item')),
    tipo: stringValue_(item.tipo).toLowerCase() === 'servico' ? 'Servico' : 'Produto',
    titulo: stringValue_(item.titulo || item.nome || ('Item ' + (index + 1))),
    descricao: stringValue_(item.descricao),
    quantidade: quantidade,
    valorUnitario: valorUnitario,
    custoUnitario: roundCurrency_(item.custoUnitario)
  };
}

function normalizePayment_(payment, index) {
  return {
    id: stringValue_(payment.id || makeId_('pay')),
    descricao: stringValue_(payment.descricao || ('Parcela ' + (index + 1))),
    valor: roundCurrency_(payment.valor),
    forma: normalizePaymentMethod_(payment.forma),
    status: financeStatusToPaymentStatus_(payment.status),
    vencimento: normalizeDateValue_(payment.vencimento),
    recebidoEm: normalizeDateValue_(payment.recebidoEm)
  };
}

function finalizePayments_(payments, defaultDate, defaultDueDate) {
  return payments.map(function (payment, index) {
    const normalized = normalizePayment_(payment, index);
    if (normalized.status === 'Pago') {
      normalized.recebidoEm = normalized.recebidoEm || normalizeDateValue_(defaultDate) || now_();
      if (!normalized.vencimento) {
        normalized.vencimento = normalized.recebidoEm;
      }
    } else if (!normalized.vencimento) {
      normalized.vencimento = normalizeDateValue_(defaultDueDate);
    }
    return normalized;
  }).filter(function (payment) {
    return payment.valor > 0;
  });
}

function calcItemTotals_(items, extraCosts) {
  let valorTotal = 0;
  let custoItens = 0;
  for (var i = 0; i < items.length; i += 1) {
    valorTotal += toNumber_(items[i].quantidade) * toNumber_(items[i].valorUnitario);
    custoItens += toNumber_(items[i].quantidade) * toNumber_(items[i].custoUnitario);
  }
  const custoOutros = roundCurrency_(extraCosts);
  const totalCustos = roundCurrency_(custoItens + custoOutros);
  const valor = roundCurrency_(valorTotal);
  return {
    valorTotal: valor,
    custoItens: roundCurrency_(custoItens),
    custoOutros: custoOutros,
    totalCustos: totalCustos,
    lucro: roundCurrency_(valor - totalCustos)
  };
}

function calcPaymentSummary_(payments, totalVenda) {
  const total = roundCurrency_(totalVenda);
  let recebido = 0;
  const metodosPagos = [];
  const vencimentosPendentes = [];
  for (var i = 0; i < payments.length; i += 1) {
    const payment = payments[i];
    if (payment.status === 'Pago') {
      recebido += toNumber_(payment.valor);
      if (payment.forma) metodosPagos.push(payment.forma);
    } else if (payment.vencimento) {
      vencimentosPendentes.push(payment.vencimento);
    }
  }
  const recebidoArredondado = roundCurrency_(recebido);
  const saldo = roundCurrency_(Math.max(total - recebidoArredondado, 0));
  let status = 'Pendente';
  if (total > 0 && saldo <= 0.009) {
    status = 'Pago';
  } else if (recebidoArredondado > 0) {
    status = 'Parcial';
  }
  const uniqueMethods = uniqueList_(metodosPagos);
  const pgto = uniqueMethods.length === 0
    ? (payments[0] && payments[0].forma ? payments[0].forma : 'Pix')
    : (uniqueMethods.length === 1 ? uniqueMethods[0] : 'Multiplo');
  return {
    recebido: recebidoArredondado,
    saldo: saldo,
    status: status,
    proximoVencimento: sortDateStrings_(vencimentosPendentes)[0] || '',
    pgto: pgto
  };
}

function summarizeItems_(items, fallback) {
  if (!items.length) return fallback || '-';
  const first = stringValue_(items[0].titulo || items[0].descricao || fallback || '-');
  return items.length === 1 ? first : first + ' +' + (items.length - 1);
}

function describeItems_(items) {
  return items.map(function (item) {
    return stringValue_(item.descricao || item.titulo);
  }).filter(Boolean).join(' | ').slice(0, 500);
}

function buildVendaFinanceDescription_(venda, payment, index) {
  const base = 'Venda ' + stringValue_(venda.numero);
  const paymentLabel = stringValue_(payment.descricao || ('Parcela ' + (index + 1)));
  const cliente = stringValue_(venda.cliente);
  return [base, cliente ? '- ' + cliente : '', '- ' + paymentLabel].join(' ').replace(/\s+/g, ' ').trim();
}

function getSheet_(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aliases = SHEET_ALIASES[name] || [name];
  let sheet = null;
  for (var i = 0; i < aliases.length; i += 1) {
    sheet = ss.getSheetByName(aliases[i]);
    if (sheet) break;
  }
  if (!sheet) {
    sheet = ss.insertSheet(aliases[0]);
  }
  ensureHeaders_(sheet, name, HEADERS[name]);
  return sheet;
}

function ensureHeaders_(sheet, name, headers) {
  const maxColumns = Math.max(headers.length, (LEGACY_HEADERS[name] || []).length || 0);
  const current = sheet.getRange(HEADER_ROW, 1, 1, maxColumns).getValues()[0];
  if (headersMatch_(current, headers)) return;

  if (LEGACY_HEADERS[name] && headersMatch_(current, LEGACY_HEADERS[name])) {
    migrateLegacySheet_(sheet, name, LEGACY_HEADERS[name], headers);
    return;
  }

  sheet.getRange(HEADER_ROW, 1, 1, headers.length).setValues([headers]);
}

function headersMatch_(current, expected) {
  if (!expected || !expected.length) return false;
  for (var i = 0; i < expected.length; i += 1) {
    if (stringValue_(current[i]) !== expected[i]) return false;
  }
  return true;
}

function migrateLegacySheet_(sheet, name, legacyHeaders, nextHeaders) {
  const lastRow = sheet.getLastRow();
  const width = Math.max(legacyHeaders.length, nextHeaders.length);
  const rows = lastRow >= DATA_START_ROW
    ? sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, legacyHeaders.length).getValues()
    : [];
  const migrated = [];

  for (var i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (row.every(function (cell) { return stringValue_(cell) === ''; })) continue;
    migrated.push(mapLegacyRow_(name, legacyHeaders, row));
  }

  const clearHeight = Math.max(lastRow - HEADER_ROW + 1, 1);
  sheet.getRange(HEADER_ROW, 1, clearHeight, width).clearContent();
  sheet.getRange(HEADER_ROW, 1, 1, nextHeaders.length).setValues([nextHeaders]);

  if (migrated.length) {
    const values = migrated.map(function (record) {
      return buildRow_(nextHeaders, record);
    });
    sheet.getRange(DATA_START_ROW, 1, values.length, nextHeaders.length).setValues(values);
  }
}

function mapLegacyRow_(name, headers, row) {
  const record = {};
  for (var i = 0; i < headers.length; i += 1) {
    record[headers[i]] = row[i];
  }
  if (name === 'orcamentos') return migrateLegacyOrcamento_(record);
  if (name === 'vendas') return migrateLegacyVenda_(record);
  return record;
}

function migrateLegacyOrcamento_(record) {
  return normalizeOrcamentoPayload_({
    numero: record.numero,
    dataHora: record.dataHora,
    cliente: record.cliente,
    produtoServico: record.produtoServico,
    descricao: record.descricao,
    validade: record.validade,
    obsPublic: record.obsPublic,
    obsPrivate: record.obsPrivate,
    custoMaterial: record.custoMaterial,
    custoOutros: record.custoOutros,
    totalCustos: record.totalCustos,
    lucro: record.lucro,
    margem: record.margem,
    valorTotal: roundCurrency_(toNumber_(record.totalCustos) + toNumber_(record.lucro)),
    status: record.status
  });
}

function migrateLegacyVenda_(record) {
  const valor = roundCurrency_(record.valor);
  const metodo = normalizePaymentMethod_(record.pgto);
  const pago = stringValue_(record.pgto).toLowerCase() !== 'pendente';
  const pagamentos = [normalizePayment_({
    id: makeId_('pay'),
    descricao: pago ? 'Pagamento integral' : 'Saldo restante',
    valor: valor,
    forma: metodo,
    status: pago ? 'Pago' : 'Pendente',
    vencimento: pago ? '' : record.dataHora,
    recebidoEm: pago ? record.dataHora : ''
  }, 0)];

  return normalizeVendaPayload_({
    numero: record.numero,
    dataHora: record.dataHora,
    cliente: record.cliente,
    produtoServico: record.produtoServico,
    descricao: record.descricao,
    valor: valor,
    totalCustos: record.totalCustos,
    lucro: record.lucro,
    margem: record.margem,
    pgto: metodo,
    pagamentosJson: JSON.stringify(pagamentos),
    obs: record.obs
  });
}

function listTable_(name) {
  const sheet = getSheet_(name);
  const headers = HEADERS[name];
  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return [];
  const values = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, headers.length).getValues();
  const rows = [];
  for (var i = 0; i < values.length; i += 1) {
    const row = values[i];
    if (row.every(function (cell) { return stringValue_(cell) === ''; })) {
      continue;
    }
    const record = { rowIndex: DATA_START_ROW + i };
    for (var j = 0; j < headers.length; j += 1) {
      record[headers[j]] = row[j];
    }
    rows.push(record);
  }
  return rows;
}

function appendRow_(name, data) {
  const sheet = getSheet_(name);
  const headers = HEADERS[name];
  const rowIndex = Math.max(sheet.getLastRow() + 1, DATA_START_ROW);
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([buildRow_(headers, data)]);
  return mergeObjects_(data, { rowIndex: rowIndex });
}

function writeRowData_(name, rowIndex, data) {
  if (!rowIndex || rowIndex < DATA_START_ROW) {
    throw new Error('Linha invalida para atualizacao.');
  }
  const sheet = getSheet_(name);
  const headers = HEADERS[name];
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([buildRow_(headers, data)]);
}

function getRecordByRowIndex_(name, rowIndex) {
  const targetRow = Number(rowIndex);
  if (!targetRow || targetRow < DATA_START_ROW) return null;
  const rows = listTable_(name);
  for (var i = 0; i < rows.length; i += 1) {
    if (Number(rows[i].rowIndex) === targetRow) return rows[i];
  }
  return null;
}

function findRecordByField_(name, field, value) {
  const expected = stringValue_(value);
  const rows = listTable_(name);
  for (var i = 0; i < rows.length; i += 1) {
    if (stringValue_(rows[i][field]) === expected) return rows[i];
  }
  return null;
}

function buildRow_(headers, data) {
  return headers.map(function (header) {
    return normalizeValue_(data[header]);
  });
}

function deleteRowsByIndexes_(sheet, indexes) {
  const uniqueIndexes = uniqueList_(indexes.map(function (index) {
    return Number(index);
  }).filter(function (index) {
    return index >= DATA_START_ROW;
  }));
  uniqueIndexes.sort(function (a, b) { return b - a; });
  for (var i = 0; i < uniqueIndexes.length; i += 1) {
    sheet.deleteRow(uniqueIndexes[i]);
  }
}

function nextCode_(name, prefix) {
  const sheet = getSheet_(name);
  const lastRow = sheet.getLastRow();
  let lastNumber = 0;
  if (lastRow >= DATA_START_ROW) {
    const columnValues = sheet.getRange(DATA_START_ROW, 1, lastRow - DATA_START_ROW + 1, 1).getValues();
    for (var i = 0; i < columnValues.length; i += 1) {
      const value = stringValue_(columnValues[i][0]);
      const match = value.match(/(\d{4})$/);
      if (match) {
        const current = parseInt(match[1], 10);
        if (current > lastNumber) lastNumber = current;
      }
    }
  }
  const year = new Date().getFullYear();
  return prefix + '-' + year + '-' + String(lastNumber + 1).padStart(4, '0');
}

function referenceBase_(reference) {
  return stringValue_(reference).split('::')[0];
}

function paymentIdFromReference_(reference) {
  const parts = stringValue_(reference).split('::');
  return parts.length > 1 ? parts[1] : '';
}

function financeStatusToPaymentStatus_(status) {
  return stringValue_(status).toLowerCase() === 'pago' ? 'Pago' : 'Pendente';
}

function normalizePaymentMethod_(value) {
  const raw = stringValue_(value).toLowerCase();
  if (raw.indexOf('dinheiro') >= 0) return 'Dinheiro';
  if (raw.indexOf('cred') >= 0) return 'Credito';
  if (raw.indexOf('deb') >= 0) return 'Debito';
  return 'Pix';
}

function normalizeDateValue_(value) {
  if (!hasValue_(value)) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return isNaN(value.getTime()) ? '' : value.toISOString();
  }
  const stringValue = String(value).trim();
  if (!stringValue) return '';
  const date = new Date(stringValue);
  if (isNaN(date.getTime())) {
    return stringValue;
  }
  return date.toISOString();
}

function parseJsonArray_(value) {
  if (!hasValue_(value)) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function normalizeValue_(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Date]') {
    return JSON.stringify(value);
  }
  return value;
}

function toNumber_(value) {
  if (!hasValue_(value)) return 0;
  const numberValue = Number(String(value).replace(',', '.'));
  return isNaN(numberValue) ? 0 : numberValue;
}

function roundCurrency_(value) {
  return Math.round(toNumber_(value) * 100) / 100;
}

function hasValue_(value) {
  return !(value === undefined || value === null || value === '');
}

function stringValue_(value) {
  return hasValue_(value) ? String(value).trim() : '';
}

function mergeObjects_(base, extra) {
  const output = {};
  const baseObject = base || {};
  const extraObject = extra || {};
  Object.keys(baseObject).forEach(function (key) {
    output[key] = baseObject[key];
  });
  Object.keys(extraObject).forEach(function (key) {
    output[key] = extraObject[key];
  });
  return output;
}

function uniqueList_(values) {
  const map = {};
  const output = [];
  for (var i = 0; i < values.length; i += 1) {
    const key = String(values[i]);
    if (!map[key]) {
      map[key] = true;
      output.push(values[i]);
    }
  }
  return output;
}

function sortDateStrings_(values) {
  return values.slice().sort(function (a, b) {
    return new Date(a).getTime() - new Date(b).getTime();
  });
}

function makeId_(prefix) {
  return prefix + '-' + Utilities.getUuid().slice(0, 8);
}

function now_() {
  return new Date().toISOString();
}
