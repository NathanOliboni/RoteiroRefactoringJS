const { readFileSync } = require('fs');
var Repositorio = require('./repositorio.js');
var ServicoCalculoFatura = require('./servico.js');
var gerarFaturaStr = require('./apresentacao.js');

function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

function gerarFaturaHTML(fatura, pecas) {
  string = "<html>\n"
  string += `<p> Fatura ${fatura.cliente} </p>\n`
  string += "<ul>\n"

  for (let apre of fatura.apresentacoes) {
    string += `<li> ${getPeca(pecas, apre).nome}: ${calcularTotalApresentacao(pecas, apre)} (${apre.audiencia} assentos) </li>\n`
  }

  string += "</ul>\n"
  string += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>\n`
  string += `<p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura)} </p>\n`

  return string
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

// const faturaHTML = gerarFaturaHTML(faturas, pecas);
// console.log(faturaHTML);