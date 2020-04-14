import { isMainThread } from "worker_threads";


let plays:{[key: string]: {"name":string,"type":"tragedy" | "comedy";};} = {
    "hamlet": {"name": "Hamlet", "type": "tragedy"},
    "as-like": {"name": "As You Like It", "type": "comedy"},
    "othello": {"name": "Othello", "type": "tragedy"}
};

let invoices:{
    "customer":string,
    "performances": {"playID":string, "audience":number}[]
}[] = [
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
    invoice:{
        "customer":string,
        "performances": {"playID":string, "audience":number}[]
    },
    plays:{[key: string]: {"name":string,"type":string;};}
):string{
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD", minimumFractionDigits: 2}).format;

    for(let pref of invoice.performances){
        const play = plays[pref.playID];
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

main();