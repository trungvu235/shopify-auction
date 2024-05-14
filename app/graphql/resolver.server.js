import jwt from "jsonwebtoken";
import AuctionModel from "~/models/auction.model";

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
    hello: () => {
        return "Hello World";
    },
    getAuction: async ({input}, request) => {
        return AuctionModel.findOne({id: input.id, key: input.key}, null, {
            returnDocument: "after",
            new: true
        }).lean();
    },
    getAuctions: async ({input}, request) => {
        const auctions = await AuctionModel.find({
            id: input.id,
        });

        return auctions;
    },

    createAuction: async ({input}, request) => {
        const {
            id, key, name, product_id, status, start_date, end_date, start_price, bid_increment, end_price,
            is_reverse_price, is_reverse_price_display, reserve_price, is_buyout_price, is_buyout_price_display,
            buyout_price
        } = input;

        return await AuctionModel.create({
            id: id,
            key: key,
            name: name,
            product_id: product_id,
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
    updateAuction: async ({input}, request) => {
        const {
            id, key, name, product_id, status, start_date, end_date, start_price, bid_increment, end_price,
            is_reverse_price, is_reverse_price_display, reserve_price, is_buyout_price, is_buyout_price_display,
            buyout_price
        } = input;

        return AuctionModel.findOneAndUpdate({
            id: id,
            key: key
        }, {
            name: name,
            product_id: product_id,
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
