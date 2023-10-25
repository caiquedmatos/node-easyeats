const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
var bodyParser = require("body-parser");

// MySQL
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "192.185.211.121", // substitua por seu hostname + a porta
  user: "caique21_easyeats", // substitua por seu username
  password: "Easyeats*2023", // substitua por sua senha
  database: "caique21_EasyEats", // substitua pelo nome do seu banco de dados
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  console.log(db);
  res.header("Access-Control-Allow-Origin", "*");
  res.send("Estamos no ar!");
});

// Inicio Login
app.post("/login", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Tentando realizar login.");
  console.log(req.body);
  let nome = req.body.nome;
  let senha = req.body.senha;

  console.log(req.body.nome);
  console.log(req.body.senha);

  db.query(`SELECT * FROM Restaurante WHERE nome="${nome}"`, (err, rows) => {
    console.log(rows);
    if (err) {
      console.log("Erro ao buscar usuário");
      res.send(err);
    } else if (rows.length === 0) {
      console.log("Usuário não encontrado");
      res.send("Usuário não encontrado");
    } else if (rows[0].senha !== senha) {
      console.log("Senha incorreta");
      res.send("Senha incorreta");
    } else {
      if (rows[0].status !== "Ativo") {
        console.log("Status Inativo");
        res.send("Status Inativo");
      } else if (rows[0].ID >= 1) {
        console.log("Bem Vindo Admin");
        console.log(rows);
        res.send(rows);
      } else {
        console.log("Login realizado com sucesso");
        console.log(rows);
        res.send(rows);
      }
    }
  });
});
// Fim Login

// Inicio da busca por todos os restaurantes
app.post("/restaurantes", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou pegando os dados dos restaurantes.");
  console.log(req.body);
  db.query(`SELECT * FROM Restaurante WHERE cargo IS NULL`, [], (err, rows) => {
    if (err) {
      console.log("Deu errinho na att");
      res.send(err);
    } else {
      console.log("Recebi um retorno do banco");
      console.log(rows);
      res.send(rows);
    }
  });
});
// Fim da busca por todos os restaurantes

// Inicio Cadastro de Restaurante
app.post("/cadastroRestaurante", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou cadastrando um novo restaurante.");
  console.log(req.body);

  let nome = req.body.nome;
  let senha = req.body.senha;

  let sql = `SELECT * FROM Restaurante WHERE nome="${nome}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else if (rows.length > 0) {
      console.log("Restaurante já existe!");
      res.send("Restaurante já existe");
    } else {
      sql = `INSERT INTO Restaurante (nome, senha) VALUES ("${nome}", "${senha}")`;
      db.query(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log("Restaurante adicionado!");
          res.send(rows);
        }
      });
    }
  });
});
// Fim Cadastro Resaturante

//Inicio Exclundo restaurante
app.post("/excluirRestaurante", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou excluindo um restaurante.");
  console.log(req.body);

  let id = req.body.id;

  let sql = `SELECT * FROM Restaurante WHERE id="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else if (rows.length === 0) {
      console.log("Restaurante não encontrado!");
      res.send("Restaurante não encontrado");
    } else {
      sql = `DELETE FROM Restaurante WHERE id="${id}"`;
      db.query(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log("Restaurante excluído!");
          res.send("Restaurante excluído");
        }
      });
    }
  });
});
//Fim Excluindo restaurante

//Inicio Edicao Perfil
app.post("/atualizarRestaurante", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou atualizando um restaurante.");
  console.log(req.body);

  let id = req.body.id;
  let nome = req.body.nome;
  let endereco = req.body.endereco;
  let descricao = req.body.descricao;
  let link = req.body.link;

  let sql = `SELECT * FROM Restaurante WHERE id="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else if (rows.length === 0) {
      console.log("Restaurante não encontrado!");
      res.send("Restaurante não encontrado");
    } else {
      sql = `UPDATE Restaurante SET nome="${nome}", endereco="${endereco}", descricao="${descricao}", link="${link}" WHERE id="${id}"`;
      db.query(sql, [], (err, rows) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log("Restaurante atualizado!");
          res.send("Restaurante atualizado");
        }
      });
    }
  });
});
//Fim Edicao Perfil

//Inicio get perfil por id
app.post("/restaurante-id", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou pegando os dados do restaurante.");
  console.log(req.body);

  let id = req.body.id;
  id = 1; //Só para testar

  let sql = `SELECT * FROM Restaurante WHERE id="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else if (rows.length > 0) {
      console.log("Restaurante encontrado!");
      res.send(rows);
    } else {
      console.log("Restaurante não encontrado!");
      res.send("Restaurante não encontrado");
    }
  });
});
//Fim get perfil por id

//Inicio get cardapio
app.post("/cardapio", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou pegando os dados do cardápio.");
  console.log(req.body);

  let id_restaurante = req.body.id_restaurante;

  let sql = `SELECT * FROM Cardapio WHERE id_restaurante="${id_restaurante}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else if (rows.length > 0) {
      console.log("Cardápio encontrado!");
      res.send(rows);
    } else {
      console.log("Cardápio não encontrado!");
      res.send("Cardápio não encontrado");
    }
  });
});
//Fim get cardapio

//Inicio Cadastro Prato Cardapio
app.post("/cadastroPratoCardapio", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou cadastrando um novo prato.");
  console.log(req.body);

  let nome = req.body.nome;
  let link = req.body.link;
  let descricao = req.body.descricao;
  let preco = req.body.preco;
  let categoria = req.body.categoria;
  let id_restaurante = req.body.id_restaurante;

  let sql = `INSERT INTO Cardapio (nome, link, descricao, preco, categoria, id_restaurante) VALUES ("${nome}", "${link}", "${descricao}", "${preco}", "${categoria}", "${id_restaurante}")`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Prato cadastrado com sucesso!");
      res.send("Prato cadastrado com sucesso");
    }
  });
});
//Fim Cadastro Prato Cardapio

//Inicio Excluir Prato Cardapio
app.post("/excluirPratoCardapio", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou excluindo um prato.");
  console.log(req.body);

  let id = req.body.id;

  let sql = `DELETE FROM Cardapio WHERE id_prato="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Prato excluído com sucesso!");
      res.send("Prato excluído com sucesso");
    }
  });
});
//Fim Excluir Prato Cardapio

//Inicio Alterar Prato Cardapio
app.post("/alterarPrato", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou alterando os dados de um prato.");
  console.log(req.body);

  let id = req.body.id;
  let nome = req.body.nome;
  let link = req.body.link;
  let descricao = req.body.descricao;
  let preco = req.body.preco;
  let categoria = req.body.categoria;

  let sql = `UPDATE Cardapio SET nome="${nome}", link="${link}", descricao="${descricao}", preco="${preco}", categoria="${categoria}" WHERE id_prato="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Dados do prato alterados com sucesso!");
      res.send("Dados do prato alterados com sucesso");
    }
  });
});
//Fim Alterar Prato Cardapio

//Inicio get Mesas
app.post("/mesas", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou pegando os dados do cardápio.");
  console.log(req.body);

  let id_restaurante = req.body.id_restaurante;

  let sql = `SELECT * FROM Mesa WHERE id_restaurante="${id_restaurante}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else if (rows.length > 0) {
      console.log("Cardápio encontrado!");
      res.send(rows);
    } else {
      console.log("Cardápio não encontrado!");
      res.send("Cardápio não encontrado");
    }
  });
});
//Fim get Mesas

//Inicio Criar Mesa
app.post("/criarMesa", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou criando uma nova mesa.");
  console.log(req.body);

  let nome = req.body.nome;
  let senha = req.body.senha;
  let descricao = req.body.descricao;
  let id_restaurante = req.body.id_restaurante;

  let sql = `INSERT INTO Mesa (nome, senha, descricao, id_restaurante) VALUES ("${nome}", "${senha}", "${descricao}", "${id_restaurante}")`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Mesa criada com sucesso!");
      res.send("Mesa criada com sucesso");
    }
  });
});
//Fim Criar Mesa

//Inicio Editar Mesa
app.post("/alterarMesa", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou alterando os dados de uma mesa.");
  console.log(req.body);

  let id = req.body.id;
  let nome = req.body.nome;
  let senha = req.body.senha;
  let descricao = req.body.descricao;

  let sql = `UPDATE Mesa SET nome="${nome}", senha="${senha}", descricao="${descricao}" WHERE id="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Dados da mesa alterados com sucesso!");
      res.send("Dados da mesa alterados com sucesso");
    }
  });
});
//Fim Editar Mesa

//Inicio Deletar Mesa
app.post("/excluirMesa", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou excluindo uma mesa.");
  console.log(req.body);

  let id = req.body.id;

  let sql = `DELETE FROM Mesa WHERE id_mesa="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Mesa excluída com sucesso!");
      res.send("Mesa excluída com sucesso");
    }
  });
});
//Fim Deletar Mesa

//Inicio Cadastro Prato Carrinho
app.post("/cadastroPratoCarrinho", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou cadastrando um novo prato.");
  console.log(req.body);

  let nome = req.body.nome;
  let link = req.body.link;
  let observacao = req.body.observacao;
  let preco = req.body.preco;
  let categoria = req.body.categoria;
  let id_restaurante = req.body.id_restaurante;
  let id_mesa = req.body.id_mesa;

  let sql = `INSERT INTO Carrinho (nome, link, descricao, preco, categoria, id_restaurante) VALUES ("${nome}", "${link}", "${observacao}", "${preco}", "${categoria}", "${id_restaurante}", "${id_mesa}")`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Prato cadastrado com sucesso!");
      res.send("Prato cadastrado com sucesso");
    }
  });
});
//Fim Cadastro Prato Carrinho

//Inicio Excluir Prato Carrinho
app.post("/excluirPratoCarrinho", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou excluindo um prato.");
  console.log(req.body);

  let id = req.body.id;

  let sql = `DELETE FROM Carrinho WHERE id_prato="${id}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Prato excluído com sucesso!");
      res.send("Prato excluído com sucesso");
    }
  });
});
//Fim Excluir Prato Carrinho

//Inicio Cadastro Prato Cozinha
app.post("/cadastroPratoCozinha", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou cadastrando um novo prato.");
  console.log(req.body);

  let nome = req.body.nome;
  let link = req.body.link;
  let observacao = req.body.observacao;
  let preco = req.body.preco;
  let categoria = req.body.categoria;
  let id_restaurante = req.body.id_restaurante;
  let id_mesa = req.body.id_mesa;

  let sql = `INSERT INTO Cozinha (nome, link, descricao, preco, categoria, id_restaurante) VALUES ("${nome}", "${link}", "${observacao}", "${preco}", "${categoria}", "${id_restaurante}", "${id_mesa}")`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Prato cadastrado com sucesso!");
      res.send("Prato cadastrado com sucesso");
    }
  });
});
//Fim Cadastro Prato Cozinha

//Inicio do get da Cozinha
app.post("/cozinha", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou pegando os dados dos pedidos da cozinha.");
  console.log(req.body);

  let id_restaurante = req.body.id_restaurante;

  let sql = `SELECT * FROM Cozinha WHERE id_restaurante="${id_restaurante}" AND estado!="entregue"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else if (rows.length > 0) {
      console.log("Pedidos encontrados!");
      res.send(rows);
    } else {
      console.log("Nenhum pedido encontrado!");
      res.send("Nenhum pedido encontrado");
    }
  });
});
//Fim do get da Cozinha

//Inicio da entrega do pedido
app.post("/entregar-pedido", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("Estou alterando o estado do pedido.");
  console.log(req.body);

  let id_prato = req.body.id;

  let sql = `UPDATE Cozinha SET estado="entregue" WHERE id="${id_prato}"`;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.log("Erro" + err);
      res.send(err);
    } else {
      console.log("Estado do pedido alterado para entregue!");
      res.send("Estado do pedido alterado para entregue");
    }
  });
});
//Fim da entrega do pedido

app.listen(port, function () {
  console.log("App está rodando na porta ", port);
});
