# GAO Joias - Sistema Administrativo

Este sistema conecta com Google Sheets via Apps Script e oferece controle de clientes, orcamentos, vendas, financeiro (entradas/saidas), lembretes e logs.

## Como configurar o Google Apps Script
1. Abra o Google Apps Script e crie um novo projeto.
2. Copie o conteudo de `apps-script/Code.gs` para o editor.
3. Copie `apps-script/appsscript.json` para o manifest (Configurar manifest no editor).
   - Observacao: todas as tabelas usam cabecalho na linha 4 e dados a partir da linha 5.
   - Abas esperadas: `clientes`, `orcamentos`, `vendas`, `logs`, `financeiro` (ou `financeiros`) e `lembretes`.
   - Cabecalho da aba `financeiro` (linha 4): `numero, dataHora, tipo, categoria, descricao, valor, status, vencimento, origem, referencia, obs`.
   - Cabecalho da aba `lembretes` (linha 4): `numero, dataHora, titulo, descricao, vencimento, status, origem, obs`.
4. Salve e publique como **Web App**:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
5. Copie a URL final do Web App (termina com `/exec`).
6. Se alterar o Apps Script, publique uma **nova versao** do Web App.
7. Se as abas `financeiro` e `lembretes` ainda nao existirem, o script cria automaticamente com cabecalho na linha 4.

## Como usar o sistema
1. Abra `index.html` em um servidor local (recomendado):
   - Exemplo: `python -m http.server` na pasta `gao_adm`.
2. Acesse o sistema no navegador e faca login.
3. Em **Configuracoes**, a URL do Apps Script ja vem preenchida. Caso precise trocar, cole a nova URL e clique em **Salvar URL**.
4. Em **Financeiro** (admin), registre entradas manuais (ex: aporte) e saidas (material, servicos, impostos, etc), com `status` e `vencimento`.
5. Em **Lembretes** (admin), acompanhe compromissos `A pagar` do financeiro e registre lembretes manuais.
6. O dashboard suporta visao por **Hoje / Semana / Mes / Ano**, com comparativos e DRE simplificado.

## Senhas
- Administrador: `************`
- Operador: `***********`

## Observacoes
- O envio de PDF no WhatsApp funciona automaticamente em celulares com Web Share. Em desktop, o link abre o WhatsApp com o texto e o PDF pode ser anexado manualmente.
- Este projeto usa autenticao simples no front-end. Para maior seguranca, implemente autenticacao e controle de acesso no Apps Script.
- Caso veja erro de rede, abra a URL `/exec` no navegador para autorizar o Apps Script e tente novamente.
- As vendas geram automaticamente uma entrada no financeiro (`origem = Venda`), e ao editar a venda o lancamento financeiro vinculado tambem e atualizado.
- O dashboard contabiliza valores financeiros apenas quando o `status` do lancamento esta como `Pago`.
- O painel de lembretes mostra compromissos `A pagar` do financeiro; ao marcar como pago, o status do lancamento financeiro e atualizado.
- Se aparecer `Acao invalida`, normalmente a URL salva no navegador aponta para um deploy antigo. Salve a URL mais recente em **Configuracoes** ou limpe o armazenamento local do navegador.
