import express from "express";
import fs from "fs";
const app = express();
const port = 3000;
const pathDataAccounts = "./src/assets/data/accounts.json";
app.use(express.json());

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.post('/account', (req, res) => {
  var jsonAccounts = recuperaJsonAccounts();
  var msg = validaCamposNovaConta(req);
  var name = req.body.name;
  var balance = req.body.balance;
  if(msg != "") {
    return res.status(400).json(msg);
  }
  var id = geraIdNovaConta(jsonAccounts);
  if(id > 0) {
    jsonAccounts.accounts.push({"id": id, "name": name, "balance": balance});
    atualizaJson(jsonAccounts);
    return res.status(200).json("Conta cadastrada com sucesso");
  }
  return res.status(500).json("Erro interno no servidor.");
});

app.put('/moneyIncrease', (req, res) => {
  var jsonAccounts = recuperaJsonAccounts();
  var msg = validaCamposDeposito(req);
  var id = req.body.id;
  var money = req.body.money;
  if(msg != "") {
    return res.status(400).json(msg);
  }
  var indice = buscaIndiceConta(id, jsonAccounts);
  if(indice >= 0) {
    jsonAccounts.accounts[indice].balance = jsonAccounts.accounts[indice].balance + money;
    atualizaJson(jsonAccounts);
    return res.status(200).json("Deposito efetuado com sucesso.");
  }
  if(indice == -1) {
    return res.status(406).json("Conta não encontrada.");
  }
  return res.status(500).json("Erro interno no servidor.");
});

app.put('/moneyDecrease', (req, res) => {
  var jsonAccounts = recuperaJsonAccounts();
  var msg = validaCamposSaque(req);
  var id = req.body.id;
  var money = req.body.money;
  console.log("moneyDecrease");
  console.log("id: " + req.body.id);
  console.log("money: " + req.body.money);
  if(msg != "") {
    return res.status(400).json(msg);
  }
  var indice = buscaIndiceConta(id, jsonAccounts);
  if(indice >= 0) {
    var saldo = jsonAccounts.accounts[indice].balance - money;
    if(saldo >= 0) {
      jsonAccounts.accounts[indice].balance = jsonAccounts.accounts[indice].balance - money;
      atualizaJson(jsonAccounts);
      return res.status(200).json("Saque efetuado com sucesso.");
    }
    return res.status(400).json("Valor indisponível para saque. Seu saldo é R$ " + jsonAccounts.accounts[indice].balance);
  }
  if(indice == -1) {
    return res.status(406).json("Conta não encontrada.");
  }
  return res.status(500).json("Erro interno no servidor.");
});

app.get('/account', (req, res) => {
  var jsonAccounts = recuperaJsonAccounts();
  var id = req.param("id");
  var indice = buscaIndiceConta(id, jsonAccounts);
  if(indice >= 0) {
    return res.status(200).json("Seu saldo é R$ " + jsonAccounts.accounts[indice].balance);
  }
  if(indice == -1) {
    return res.status(406).json("Conta não encontrada.");
  }
  return res.status(500).json("Erro interno no servidor.");
});

app.delete('/account', (req, res) => {
  var jsonAccounts = recuperaJsonAccounts();
  var id = req.param("id");
  var indice = buscaIndiceConta(id, jsonAccounts);
  if(indice >= 0) {
    jsonAccounts.accounts.splice(indice, 1);
    atualizaJson(jsonAccounts);
    return res.status(200).json("Conta excluída com sucesso.");
  }
  if(indice == -1) {
    return res.status(406).json("Conta não encontrada.");
  }
  return res.status(500).json("Erro interno no servidor.");
});

function recuperaJsonAccounts() {
  return JSON.parse(fs.readFileSync(pathDataAccounts).toString());
}

function validaCamposNovaConta(req) {
  if(req.body.name == undefined) {
    return "Campo name não encontrado.";
  }
  if(req.body.balance == undefined) {
    return "Campo balance não encontrado.";
  }
  if(req.body.name == null || req.body.name == "") {
    return "Campo name é obrigatório.";
  }
  if(req.body.balance == null) {
    return 'Campo balance é obrigatório.';
  }
  return "";
}

function validaCamposDeposito(req) {
  if(req.body.id == undefined) {
    return "Campo id não encontrado.";
  }
  if(req.body.money == undefined) {
    return "Campo money não encontrado.";
  }
  if(req.body.money < 1) {
    return "O valor mínino de depósito é: R$ 1,00.";
  }
  return "";
}

function validaCamposSaque(req) {
  if(req.body.id == undefined) {
    return "Campo id não encontrado.";
  }
  if(req.body.money == undefined) {
    return "Campo money não encontrado.";
  }
  if(req.body.money < 1) {
    return "O valor mínino de saque é: R$ 1,00.";
  }
  return "";
}

function buscaIndiceConta(id, jsonAccounts) {
  for(var i=0; i < jsonAccounts.accounts.length; i++) {
    if(jsonAccounts.accounts[i].id == id) {
      return i;
    }
  }
  return -1;
}

function atualizaJson(jsonAccounts) {
  var json = JSON.stringify(jsonAccounts);
    fs.writeFile(pathDataAccounts, json, function(error) {
      if (error) {
        console.error("Erro no método atualizaJson:  " + error.message);
      } else {
        console.log(`Arquivo ${pathDataAccounts} atualizado.`);
      }
    });
}

function geraIdNovaConta(jsonAccounts) {
  var id = 0;
  var idExiste = true;
  while(idExiste) {
    id++;
    idExiste = verificaSeIdExiste(jsonAccounts, id);
  }
  return id;
}

function verificaSeIdExiste(jsonAccounts, id) {
  for(var i=0; i < jsonAccounts.accounts.length; i++) {
    if(jsonAccounts.accounts[i].id == id) {
      return true;
    }
  }
  return false;
}