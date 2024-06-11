import jwt from "jsonwebtoken";
import AuctionModel from "~/models/auction.model";
import BidModel from "~/models/bid.model";

export const verifyToken = async (bearerToken) => {
    if (!bearerToken) {
        throw new Error('You have to provide bearer token on the request headers');
    } else {
        const token = bearerToken.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        console.log('DECODED: ', decoded);
        if (!decoded) {
            throw new Error('Invalid access token');
        }
        return true;
    }
}

export const resolver = {
    getAuction: async ({input}, request) => {
        return AuctionModel.findOne({id: input.id, key: input.key}, null, {
            returnDocument: "after",
            new: true
        }).lean();
    },
    getAuctionsByCustomer: async ({input}, request) => {
        const auctions = await AuctionModel.find({
            id: input.id,
            winner_id: input.winner_id
        }, null,{ new: true});

        return auctions;
    },
    getAuctionsByKeys: async ({input}, request) => {
        const auctions = await AuctionModel.find({
            id: input.id,
            key: input.winner_id
        }, null,{ new: true});

        return auctions;
    },
    getActiveAuctions: async ({input}, request) => {
        const now2 = new Date();
        const timezoneOffset = now2.getTimezoneOffset();
        const now = new Date(now2.getTime() - (timezoneOffset * 60 * 1000)).toISOString().slice(0, 16);
        const auctions = await AuctionModel.find({
            id: input.id,
            start_date: { $lt: now },
            end_date: { $gt: now },
        }, null,{ new: true});

        return auctions;
    },
    getScheduledAuctions: async ({input}, request) => {
        const now2 = new Date();
        const timezoneOffset = now2.getTimezoneOffset();
        const now = new Date(now2.getTime() - (timezoneOffset * 60 * 1000)).toISOString().slice(0, 16);

        const auctions = await AuctionModel.find({
            id: input.id,
            start_date: { $gt: now },
        }, null,{ new: true});

        return auctions;
    },
    getUnsolvedAuctions: async ({input}, request) => {
        const now2 = new Date();
        const timezoneOffset = now2.getTimezoneOffset();
        const now = new Date(now2.getTime() - (timezoneOffset * 60 * 1000)).toISOString().slice(0, 16);
        const auctions = await AuctionModel.find({
            id: input.id,
            end_date: { $lt: now },
            status: 'unsolved',
        }, null,{ new: true});

        return auctions;
    },
    getAuctions: async ({input}, request) => {
        if(input.key) {
            const key_list = JSON.parse(input.key);
            const autions = await AuctionModel.find({
                key: {
                    $in: key_list
                }
            }, null, {
                lean: true,
            });

            return autions
        } else {
            const auctions = await AuctionModel.find({
                id: input.id,
            }, null,{ new: true});

            return auctions;
        }

    },
    getBids: async ({input}, request) => {
        const bids = await BidModel.find({
            id: input.id,
        }, null,{ new: true});

        return bids;
    },

    createAuction: async ({input}, request) => {
        const {
            id, key, name, product_id, auction_thumbnail, winner_id, contact_number, status, start_date, end_date, start_price, bid_increment, end_price,
            is_reverse_price, is_reverse_price_display, reserve_price, is_buyout_price, is_buyout_price_display,
            buyout_price
        } = input;

        return await AuctionModel.create({
            id: id,
            key: key,
            name: name,
            product_id: product_id,
            auction_thumbnail: auction_thumbnail,
            winner_id: winner_id,
            contact_number: contact_number,
            status: status,
            start_date: start_date,
            end_date: end_date,
            start_price: start_price,
            bid_increment: bid_increment,
            end_price: end_price,
            is_reverse_price: is_reverse_price,
            is_reverse_price_display: is_reverse_price_display,
            reserve_price: reserve_price,
            is_buyout_price: is_buyout_price,
            is_buyout_price_display: is_buyout_price_display,
            buyout_price: buyout_price,
        });
    },

    createBid: async ({input}, request) => {
        const {
            id, key
        } = input;

        const existingBid = await BidModel.findOne({ id, key });
        if (existingBid) {
            return;
        }

        return await BidModel.create({
            id: id,
            key: key,
        });
    },

    updateAuction: async ({input}, request) => {
        const {
            id, key, name, product_id, winner_id, contact_number, auction_thumbnail, status, start_date, end_date, start_price, bid_increment, end_price,
            is_reverse_price, is_reverse_price_display, reserve_price, is_buyout_price, is_buyout_price_display,
            buyout_price
        } = input;

        return AuctionModel.findOneAndUpdate({
            id: id,
            key: key
        }, {
            name: name,
            product_id: product_id,
            auction_thumbnail: auction_thumbnail,
            winner_id: winner_id,
            contact_number: contact_number,
            status: status,
            start_date: start_date,
            end_date: end_date,
            start_price: start_price,
            bid_increment: bid_increment,
            end_price: end_price,
            is_reverse_price: is_reverse_price,
            is_reverse_price_display: is_reverse_price_display,
            reserve_price: reserve_price,
            is_buyout_price: is_buyout_price,
            is_buyout_price_display: is_buyout_price_display,
            buyout_price: buyout_price
        }, {
            returnDocument: "after",
            new: true
        })
    },
}
