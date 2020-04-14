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
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 2}).format;

    for(let pref of invoice.performances){
        const play = plays[pref.playID];
        let thisAmount = amountFor(pref,play);

        // add volume credits
        volumeCredits += Math.max(pref.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if(play.type == "comedy") volumeCredits += Math.floor(pref.audience / 5);

        // print line for this order
        result += `${play.name}: ${format(thisAmount/100)} (${pref.audience}) seats)\n`
        totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
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
function amountFor(pref:Performance, play:Play) {
    let thisAmount = 0;
    switch (play.type) {
        case "tragedy":
            thisAmount = 40_000;
            if(pref.audience > 30) {
                thisAmount += 1000 * (pref.audience - 30);
            }
            break;
        case "comedy":
            thisAmount = 30_000;
            if(pref.audience > 20) {
                thisAmount += 10_000 + 500 * (pref.audience -  20);
            }
            thisAmount += 300 * pref.audience;
            break;
        default:
            throw new Error(`Unknown type ${play.type}`);
    }
    return thisAmount;
}

module.exports = {
    plays: plays,
    invoices: invoices,
    statement: statement
}