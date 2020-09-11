const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

app.post('/account', (req, res) => {//TODO cria conta com ID, name e balance
  var msg = validaCamposNovaConta(req);
  if(msg != "") {
    return res.status(400).json(msg);
  }
  return res.status(200).json("Conta cadastrada com sucesso");
});

app.post('/moneyIncrease', (req, res) => {//TODO deposito - recebe id e valor
  //var msg = validaCamposDeposito(req);
  console.log("moneyIncrease");
  console.log("id: " + req.body.id);
  console.log("money: " + req.body.money);
  var msg = "";
  if(msg != "") {
    return res.status(400).json(msg);
  }
  return res.status(200).json("Deposito feito com sucesso");
});

app.post('/moneyDecrease', (req, res) => {//TODO saque - recebe id e valor
  //var msg = validaCamposSaque(req);
  console.log("moneyDecrease");
  console.log("id: " + req.body.id);
  console.log("money: " + req.body.money);
  var msg = "";
  if(msg != "") {
    return res.status(400).json(msg);
  }
  return res.status(200).json("Saque feito com sucesso");
});

app.get('/account', (req, res) => {
  console.log(req.param("id"));
  //validar conta não encontrada
  return res.status(200).json("Seu saldo é xxx");
});

app.delete('/account', (req, res) => {
  console.log(req.param("id"));
  //excluir conta conta não encontrada
  //validar conta não encontrada
  return res.status(200).json("Conta excluída com sucesso");
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});


function validaCamposNovaConta(req) {
  if(req.body.name == undefined) {
    return "Campo name não encontrado";
  }
  if(req.body.balance == undefined) {
    return "Campo balance não encontrado";
  }
  if(req.body.name == null || req.body.name == "") {
    return "Campo name é obrigatório";
  }
  if(req.body.balance == null) {
    return 'Campo balance é obrigatório';
  }
  return "";
}