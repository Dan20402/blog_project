const mongoose = require('mongoose');

const entradaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  conteudo: { type: String, required: true },
  criadaEm: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Entrada', entradaSchema);
