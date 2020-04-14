import { isMainThread } from "worker_threads";

interface Play{"name":string,"type":"tragedy" | "comedy";};
interface Plays{[key: string]: Play}

let plays:Plays = {
    "hamlet": {"name": "Hamlet", "type": "tragedy"},
    "as-like": {"name": "As You Like It", "type": "comedy"},
    "othello": {"name": "Othello", "type": "tragedy"}
};

interface Performance{"playID":string, "audience":number}
interface Invoice{
    "customer":string,
    "performances": Performance[]
}
let invoices:Invoice[] = [
    {
        "customer": "BigCo",
        "performances": [
            {
                playID: "hamlet",
                audience: 55
            },
            {
                playID: "as-like",
                audience: 35
            },
            {
                playID: "othello",
                audience: 40
            }
        ]
    }
];

function statement(
    invoice:Invoice,
    plays:Plays
):string{
    const statementData = {}
    return renderPlainText(statementData, invoice);
}

function renderPlainText(statementData,invoice: Invoice) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        // print line for this order
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}) seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmountFor(invoice))}\n`;
    result += `You earned ${creditsFor(invoice)} credits\n`;
    return result;
}

function totalAmountFor(invoice: Invoice):number {
    let result = 0;
    for (let perf of invoice.performances) {
        result += amountFor(perf);
    }
    return result;
}

function creditsFor(invoice: Invoice):number {
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
}

function volumeCreditsFor(perf:Performance): number {
    // add volume credits
    let result = Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if (playFor(perf).type == "comedy")
    result += Math.floor(perf.audience / 5);
    return result;
}

function main(){
    for(let invoice of invoices){
        console.info(statement(invoice,plays))
    }
}

// 第一步，拆解
// 第一个引起注意的是 switch 语句。
// 他们格式类似，可以转换成一个函数

// 首先，检查哪些变量会离开原本的作用域
// 此例中是： pref / play 和 thisAmount
// 前两个会被提炼传参不会再被修改，只有 thisAmount 会被修改。
// 因此，可以将之当成函数返回值
function amountFor(aPerformance:Performance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40_000;
            if(aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30_000;
            if(aPerformance.audience > 20) {
                result += 10_000 + 500 * (aPerformance.audience -  20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`Unknown type ${playFor(aPerformance).type}`);
    }
    return result;
}

function playFor(performance: Performance):Play {
    return plays[performance.playID];
}

function usd(aNumber) : string {
    return new Intl.NumberFormat("en-US",{
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber/100);
}

// 修改完毕后，执行单测，发现正常
// 要养成重构后即时运行测试的习惯，因为犯错是容易的
// 测试通过后，需要把代码提交到git上。以便后面搞砸了可以回滚。

module.exports = {
    plays: plays,
    invoices: invoices,
    statement: statement
}


main();