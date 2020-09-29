//Teste de github

const Entrada = require('./model');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

mongoose.connect(
  'mongodb+srv://admin:test123@cluster0.yv2af.mongodb.net/testeDB?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.get('/edit:id', (req, res) => {
  Entrada.findById(req.params.id, (err, entrada) => {
    if (!err) {
      res.render('edit', { entrada: entrada });
    } else {
      console.log('Error ' + err);
    }
  });
});

//**********Todos os artigos**********

app
  .route('/')
  .get((req, res) => {
    Entrada.find({}, (err, entrada) => {
      let mostreButton;
      if (entrada.length === 0) {
        mostreButton = '';
      } else {
        mostreButton =
          '<button class="btn btn-secondary m-2" type="submit">Deletar todos</button>';
      }
      try {
        res.render('home', { entrada: entrada, mostreButton: mostreButton });
      } catch (err) {
        console.log(err);
      }
    });
  })
  .post((req, res) => {
    let novaEntrada = new Entrada({
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      criadaEm: req.body.criadaEm,
    });
    try {
      novaEntrada.save();
      res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  })

  .delete((req, res) => {
    Entrada.deleteMany({}, (err, result) => {
      if (!err) {
        res.redirect('/');
      } else {
        console.log(err);
      }
    });
  });

//**********Um artigo**********

app
  .route('/entry:id')

  .get((req, res) => {
    Entrada.findById(req.params.id, (err, entrada) => {
      try {
        res.render('post', { entrada: entrada });
      } catch (err) {
        console.log(err);
      }
    });
  })

  .patch((req, res) => {
    Entrada.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      (err, result) => {
        try {
          res.redirect('/');
        } catch (err) {
          console.log(err);
        }
      }
    );
  })

  .delete((req, res) => {
    Entrada.findOneAndDelete({ _id: req.params.id }, (err, entrada) => {
      try {
        res.redirect('/');
      } catch (err) {
        console.log('Meu erro ' + err);
      }
    });
  });

app.listen('3000', console.log('Connected on port 3000'));
