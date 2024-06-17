import {agenda} from "../shopify.server";
import {GET_CUSTOMERS_BY_AUCTION} from "../graphql/query";
import {UPDATE_AUCTION} from "../graphql/mutation";
import client from "../graphql/client";

export default async function handleCalculate(auctionKey, scheduleTime, storeId){
    await agenda.define('auction-calculate', async job => {
        const {key, store_id} = job.attrs.data;
        try {
            console.log(`auctionKey: ${key}`);
            const response = await client.query({
                query: GET_CUSTOMERS_BY_AUCTION,
                variables: {
                    input: {
                        key: key
                    }
                },
                fetchPolicy: "no-cache"
            });
            const bidsList = response.data.getCustomersByAuction;
            if (Array.isArray(bidsList) && bidsList.length > 0) {
                let highestBid = bidsList[0];
                bidsList.forEach(bid => {
                    if (bid.bid > highestBid.bid) {
                        highestBid = bid;
                    }
                    if (bid.bid === highestBid.bid && (new Date(bid.updatedAt) < new Date(highestBid.updatedAt))) {
                        highestBid = bid;
                    }
                });
                console.log('Highest bid:', highestBid);
                try {
                    const responseUpdate = client.mutate({
                        mutation: UPDATE_AUCTION,
                        variables: {
                            input: {
                                id: store_id,
                                key: key,
                                end_price: parseFloat(highestBid.bid),
                                winner_id: highestBid.id,
                                contact_number: highestBid.contact_number,
                            }
                        }
                    });
                    console.log('update successfully');
                } catch (mutationError) {
                    console.error('Error mutation auction:', mutationError);
                }
            } else {
                console.log('No bids found.');
            }
        } catch (error) {
            console.error('Error fetching bids list:', error);
        }
    });
    const date = new Date(scheduleTime);
    await agenda.schedule(date, 'auction-calculate',
        {
            key: auctionKey,
            store_id: storeId,
        }
    );
    console.log('schedule cron job created');
}
