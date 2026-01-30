const SPREADSHEET_ID = '15vvhb0nWCFuaCoeYZXeXXH8mZuiTSfIZZxX6BKwQtFU';

const HEADER_ROW = 4;
const DATA_START_ROW = HEADER_ROW + 1;

// const HEADERS = {
//   clientes: ['dataHora', 'nome', 'telefone', 'email', 'empresa', 'cpfCNPJ', 'obs'],
//   orcamentos: ['numero', 'dataHora', 'cliente', 'produtoServico', 'descricao', 'validade', 'obsPublic', 'obsPrivate', 'custoMaterial', 'custoOutros', 'totalCustos', 'lucro', 'margem', 'status'],
//   vendas: ['numero', 'dataHora', 'cliente', 'produtoServico', 'descricao', 'valor', 'totalCustos', 'lucro', 'margem', 'pgto', 'obs'],
//   logs: ['user', 'perfil', 'dataHora', 'sistema', 'navegador', 'ip']
// };

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const payload = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = payload.action || (e && e.parameter && e.parameter.action);
    let data = payload.payload || {};
    if (!payload.payload && e && e.parameter && e.parameter.payload) {
      data = JSON.parse(e.parameter.payload);
    }
    const response = dispatch_(action, data);
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
        logs: listTable_('logs')
      };
    case 'createCliente':
      return appendRow_('clientes', data);
    case 'createOrcamento':
      return createOrcamento_(data);
    case 'updateOrcamento':
      return updateRow_('orcamentos', data);
    case 'createVenda':
      return createVenda_(data);
    case 'updateVenda':
      return updateRow_('vendas', data);
    case 'logLogin':
      return appendRow_('logs', data);
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

function getSheet_(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(HEADER_ROW, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]);
  }
  ensureHeaders_(sheet, HEADERS[name]);
  return sheet;
}

function ensureHeaders_(sheet, headers) {
  const current = sheet.getRange(HEADER_ROW, 1, 1, headers.length).getValues()[0];
  const needsUpdate = headers.some((h, i) => current[i] !== h);
  if (needsUpdate) {
    sheet.getRange(HEADER_ROW, 1, 1, headers.length).setValues([headers]);
  }
}

function listTable_(name) {
  const sheet = getSheet_(name);
  const lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return [];
  const headers = sheet.getRange(HEADER_ROW, 1, 1, HEADERS[name].length).getValues()[0];
  const values = sheet.getRange(DATA_START_ROW, 1, lastRow - HEADER_ROW, headers.length).getValues();
  return values.map((row, index) => {
    const obj = { rowIndex: DATA_START_ROW + index };
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

function appendRow_(name, data) {
  const sheet = getSheet_(name);
  const headers = HEADERS[name];
  const row = headers.map((header) => normalizeValue_(data[header]));
  const rowIndex = Math.max(sheet.getLastRow() + 1, DATA_START_ROW);
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
  return Object.assign({ rowIndex }, data);
}

function updateRow_(name, data) {
  const rowIndex = Number(data.rowIndex);
  if (!rowIndex) throw new Error('rowIndex obrigatorio');
  const sheet = getSheet_(name);
  const headers = HEADERS[name];
  const row = headers.map((header) => normalizeValue_(data[header]));
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([row]);
  return data;
}

function createOrcamento_(data) {
  if (!data.numero) {
    data.numero = nextCode_('orcamentos', 'ORC');
  }
  if (!data.dataHora) {
    data.dataHora = now_();
  }
  if (!data.status) {
    data.status = 'Em negociacao';
  }
  return appendRow_('orcamentos', data);
}

function createVenda_(data) {
  if (!data.numero) {
    data.numero = nextCode_('vendas', 'VEN');
  }
  if (!data.dataHora) {
    data.dataHora = now_();
  }
  if (!data.pgto) {
    data.pgto = 'Pendente';
  }
  return appendRow_('vendas', data);
}

function nextCode_(name, prefix) {
  const sheet = getSheet_(name);
  const lastRow = sheet.getLastRow();
  let lastNumber = 0;
  if (lastRow > 1) {
    const lastValue = String(sheet.getRange(lastRow, 1).getValue());
    const match = lastValue.match(/(\d{4})$/);
    if (match) lastNumber = parseInt(match[1], 10);
  }
  const year = new Date().getFullYear();
  const next = String(lastNumber + 1).padStart(4, '0');
  return `${prefix}-${year}-${next}`;
}

function now_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function normalizeValue_(value) {
  if (value === undefined || value === null) return '';
  return value;
}
