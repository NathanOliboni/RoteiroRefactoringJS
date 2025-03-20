const { readFileSync } = require('fs');

function calcularTotalApresentacao(apre, pecas) {
    let total = 0;
    const peca = getPeca(apre, pecas);
    switch (peca.tipo) {
        case "tragedia":
            total = 40000;
            if (apre.audiencia > 30) {
                total += 1000 * (apre.audiencia - 30);
            }
            break;
        case "comedia":
            total = 30000;
            if (apre.audiencia > 20) {
                total += 10000 + 500 * (apre.audiencia - 20);
            }
            total += 300 * apre.audiencia;
            break;
        default:
            throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total / 100;
}

function calcularTotalFatura(fatura, pecas) {
    return fatura.apresentacoes.reduce((total, apre) => total + calcularTotalApresentacao(apre, pecas), 0);
}

function calcularTotalCreditos(fatura, pecas) {
    return fatura.apresentacoes.reduce((creditos, apre) => {
        let creditosAtuais = Math.max(apre.audiencia - 30, 0);
        if (getPeca(apre, pecas).tipo === "comedia") {
            creditosAtuais += Math.floor(apre.audiencia / 5);
        }
        return creditos + creditosAtuais;
    }, 0);
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor);
}

function getPeca(apre, pecas) {
    return pecas[apre.id];
}

function gerarFaturaStr(fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(calcularTotalApresentacao(apre, pecas))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
    let html = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>`;
    for (let apre of fatura.apresentacoes) {
        html += `<li>  ${getPeca(apre, pecas).nome}: ${formatarMoeda(calcularTotalApresentacao(apre, pecas))} (${apre.audiencia} assentos) </li>\n`;
    }
    html += `</ul>\n<p> Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))} </p>\n`;
    html += `<p> Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} </p>\n</html>`;
    return html;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
const faturaHTML = gerarFaturaHTML(faturas, pecas);

console.log(faturaStr);
console.log(faturaHTML);