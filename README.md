# GAO Joias - Sistema Administrativo

Este sistema conecta com Google Sheets via Apps Script e oferece controle de clientes, orcamentos, vendas, financeiro (entradas/saidas) e logs.

## Como configurar o Google Apps Script
1. Abra o Google Apps Script e crie um novo projeto.
2. Copie o conteudo de `apps-script/Code.gs` para o editor.
3. Copie `apps-script/appsscript.json` para o manifest (Configurar manifest no editor).
   - Observacao: todas as tabelas usam cabecalho na linha 4 e dados a partir da linha 5.
   - Abas esperadas: `clientes`, `orcamentos`, `vendas`, `logs` e `financeiro`.
   - Cabecalho da aba `financeiro` (linha 4): `numero, dataHora, tipo, categoria, descricao, valor, origem, referencia, obs`.
4. Salve e publique como **Web App**:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
5. Copie a URL final do Web App (termina com `/exec`).
6. Se alterar o Apps Script, publique uma **nova versao** do Web App.
7. Se a aba `financeiro` ainda nao existir, o script cria automaticamente com cabecalho na linha 4.

## Como usar o sistema
1. Abra `index.html` em um servidor local (recomendado):
   - Exemplo: `python -m http.server` na pasta `gao_adm`.
2. Acesse o sistema no navegador e faca login.
3. Em **Configuracoes**, a URL do Apps Script ja vem preenchida. Caso precise trocar, cole a nova URL e clique em **Salvar URL**.
4. Em **Financeiro** (admin), registre entradas manuais (ex: aporte) e saidas (material, servicos, impostos, etc).
5. O dashboard agora suporta visao por **Hoje / Semana / Mes / Ano**, com comparativos e DRE simplificado.

## Senhas
- Administrador: `*************`
- Operador: `***********`

## Observacoes
- O envio de PDF no WhatsApp funciona automaticamente em celulares com Web Share. Em desktop, o link abre o WhatsApp com o texto e o PDF pode ser anexado manualmente.
- Este projeto usa autenticao simples no front-end. Para maior seguranca, implemente autenticacao e controle de acesso no Apps Script.
- Caso veja erro de rede, abra a URL `/exec` no navegador para autorizar o Apps Script e tente novamente.
- As vendas geram automaticamente uma entrada no financeiro (`origem = Venda`), e ao editar a venda o lancamento financeiro vinculado tambem e atualizado.
