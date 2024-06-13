import {agenda} from "../shopify.server";
export default async function handleCalculate(){
    if (agenda) {
        await agenda.define('say-hello', job => {
            console.log('Hello!');
        });
        await agenda.every('1 minute', 'say-hello');
        console.log('every cron job created');
        await agenda.schedule('tomorrow at noon', 'say-hello');
        console.log('schedule cron job created');
    } else {
        console.error('Agenda object is undefined');
        console.log(agenda);
    }
}
