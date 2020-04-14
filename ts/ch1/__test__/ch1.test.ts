const ch1 = require('../ch1.ts');

interface DependData {
    [key: string]: string;
}
let a:DependData = {"a":"b"};

test('result should correct', () => {
    const result = 'Statement for BigCo\n\
Hamlet: $650.00 (55) seats)\n\
As You Like It: $580.00 (35) seats)\n\
Othello: $500.00 (40) seats)\n\
Amount owed is $1,730.00\n\
You earned 47 credits\n';
    for(let invoice of ch1.invoices){
        let tmp = ch1.statement(invoice,ch1.plays);
        expect(tmp).toBe(result);
    }
});