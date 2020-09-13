# express-my-bank-api
Teste API com Express

Arquivo ./src/assets/data/accounts.json fazendo fazendo papel de banco de dados.

Comando para inicializar a aplicação:
  node ./src/app.js

endpoints:
  verificar saldo (HTTP GET): localhost:3000/account?id=1

  criar conta (HTTP POST): localhost:3000/account
  {
    "name":"TESTE",
    "balance":5000
  }

  efetuar depósito (HTTP PUT): localhost:3000/moneyIncrease
  {
    "id":3,
    "money":85
  }

  efetuar saque (HTTP PUT): localhost:3000/moneyDecrease
  {
    "id":3,
    "money":85
  }

  excluir conta (HTTP DELETE): localhost:3000/account?id=1