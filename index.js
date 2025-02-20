const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {
    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    const formato = new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format;

    function calcularTotalApresentacao(apre, peca) { // Função extraída
        let total = 0;
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
        return total;
    }

    function calcularCredito(apre, peca) { // Função extraída
        let creditos = Math.max(apre.audiencia - 30, 0);
        if (peca.tipo === "comedia") {
            creditos += Math.floor(apre.audiencia / 5);
        }
        return creditos;
    }

    function formatarMoeda(valor) { // Função extraída
      return new Intl.NumberFormat("pt-BR",
        {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2
        }).format(valor);
    }

    function getPeca(apre) { // Função extraída
        return pecas[apre.id];
    }

    for (let apre of fatura.apresentacoes) {
        let total = calcularTotalApresentacao(apre, getPeca(apre)); // valor da apresentação
        // créditos para próximas contratações
        creditos += calcularCredito(apre, getPeca(apre));

        if (getPeca(apre).tipo === "comedia") {
            creditos += Math.floor(apre.audiencia / 5);
        }

        // mais uma linha da fatura
        faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(total / 100)} (${apre.audiencia} assentos)\n`;
        totalFatura += total;
    }
    faturaStr += `Valor total: ${formatarMoeda(totalFatura / 100)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
