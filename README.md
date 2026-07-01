# GAO Joias - Admin e Ecommerce

Sistema PHP/MySQL para administrar clientes, orcamentos, vendas, financeiro, lembretes, produtos, inventario e pedidos da loja online com checkout Stripe.

## Requisitos
- PHP 8.1+ com PDO MySQL.
- MySQL ou MariaDB.
- Hospedagem com HTTPS para usar Stripe em producao.

## Instalacao local no XAMPP
1. Inicie Apache e MySQL no XAMPP.
2. Importe o banco:
   ```bash
   C:\xampp\mysql\bin\mysql.exe -u root < C:\xampp\htdocs\gaoapp\database\schema.sql
   ```
3. Opcional: copie `.env.example` para `.env` e ajuste `APP_BASE_URL`, banco e chaves Stripe.
4. Acesse `http://localhost/gaoapp/index.html`.

Login inicial:
- Usuario: `admin@gao.local`
- Senha: `Gao@2026!`

Troque essa senha no banco antes de publicar.

## Loja online
- Catalogo: `http://localhost/gaoapp/loja/index.php`
- Carrinho: `http://localhost/gaoapp/loja/cart.php`
- Webhook Stripe: `https://seu-dominio.com/api/stripe-webhook.php`

Produtos aparecem na loja quando o status estiver como `Ativo na loja`. O estoque e reservado ao criar o checkout e baixado quando a Stripe confirma o pagamento pelo webhook.

## Acessos administrativos
- Administrador: usuario `Administrador` ou `admin@gao.local`.
- Operador: usuario `Operador` ou `operador@gao.local`.

As senhas iniciais estao definidas em `database/2026_05_28_admin_users.sql`. Troque-as antes de uso definitivo em producao se outras pessoas tiverem acesso ao repositorio.

## Impressao no Chrome OS Flex
- HP Deskjet 2874: use impressao normal/PDF pelo dialogo do Chrome.
- Bematech MP-4200 HS: use `Configuracoes > Bematech MP-4200 HS`, que imprime direto via Web Serial/ESC-POS.

Guia: `IMPRESSAO_CHROME_OS.md`.

## Stripe
Configure no `.env`:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=brl
```

Eventos recomendados no webhook:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

## Hostinger
1. Conecte o repositorio GitHub da GAO Joias no hPanel da Hostinger.
2. Configure auto-deploy da branch `main` para `public_html`.
3. Crie o banco MySQL pelo painel da Hostinger.
4. Importe `database/schema.sql` pelo phpMyAdmin.
5. Crie um `.env` no servidor com base em `HOSTINGER_PRODUCTION.env.template`.
6. Aponte o webhook no painel da Stripe para `/api/stripe-webhook.php`.

Guia completo: `HOSTINGER_GITHUB_DEPLOY.md`.

## Seguranca implementada
- Senhas com `password_hash` e `password_verify`.
- Sessao PHP com cookie `HttpOnly` e `SameSite=Lax`.
- CSRF em chamadas administrativas.
- API administrativa protegida por sessao.
- Assinatura do webhook Stripe verificada por HMAC.
- Pastas `app` e `config` bloqueadas por `.htaccess`.
