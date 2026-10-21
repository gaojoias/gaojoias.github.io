# Deploy GAO Joias com GitHub e Hostinger

Este projeto esta pronto para o fluxo de GitHub + Hostinger: o codigo fica no GitHub e a Hostinger publica a branch configurada no diretorio do site.

Referencia oficial da Hostinger: https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger

## 1. Preparar o GitHub

1. Crie o repositorio da GAO Joias no GitHub.
2. Use a branch principal `main`.
3. Nunca envie `.env` nem `config/config.php` para o GitHub. Eles estao protegidos pelo `.gitignore`.

## 2. Preparar a Hostinger

1. No hPanel, crie o site/domino da GAO Joias.
2. Crie um banco MySQL.
3. Importe `database/schema.sql` pelo phpMyAdmin.
4. Crie `gaoapp_config.php` na pasta **acima** de `public_html` (com base em `config/config.example.php`): o deploy do Git apaga de `public_html` tudo que nao esta no repositorio, inclusive `.env` e `config/config.php`.
5. Ajuste `app.base_url`, o banco de dados e mantenha `cookie_secure` ligado.

## 3. Conectar GitHub na Hostinger

1. No hPanel, abra a area de Git/deploy do site.
2. Conecte a conta GitHub autorizando o acesso ao repositorio da GAO Joias.
3. Selecione o repositorio e a branch `main`.
4. Defina o diretorio de deploy como `public_html` ou a pasta do subdominio escolhido.
5. Ative auto-deploy para publicar automaticamente a cada push na branch.

## 4. Fluxo de atualizacao

1. Edite localmente em `C:\xampp\htdocs\gaoapp`.
2. Teste no XAMPP.
3. Commit e push para `main`.
4. A Hostinger recebe a atualizacao e publica a versao nova.

## 5. Stripe em producao

Conecte pelo painel: **Configuracoes → Pagamentos**. Cole a chave secreta (`sk_test_...` para testar, `sk_live_...` para vender):
o painel confere a conta na Stripe, cria o webhook abaixo automaticamente e guarda as chaves em `gaoapp_stripe.json`,
fora de `public_html` (nao some nos deploys e nunca vai para o GitHub).

O webhook criado aponta para:

```text
https://www.seu-dominio.com.br/api/stripe-webhook.php
```

Eventos recomendados:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
```

## 6. Checklist antes de publicar

1. Trocar a senha do usuario administrador inicial.
2. Confirmar HTTPS ativo no dominio.
3. Conferir `.env` no servidor.
4. Conferir banco importado.
5. Conferir chaves Stripe.
6. Testar `https://www.seu-dominio.com.br/loja/`.
7. Testar `https://www.seu-dominio.com.br/api/stripe-webhook.php` pela Stripe.
