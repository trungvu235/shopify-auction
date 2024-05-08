const {buildSchema} = require("graphql")

export const schema = buildSchema(`
    scalar JSON
    scalar Date

    input GetAuctionInput {
        id: String,
        key: String,
    }

    input GetAuctionsListInput {
        id: String,
    }

    type AuctionSchema {
        id: String,
        key: String,
        name: String,
        product_id: String,
        status: Boolean,
        start_date: String,
        end_date: String,
        start_price: Int,
        bid_increment: Int,
        end_price: Int,
        is_reverse_price: Boolean,
        is_reverse_price_display: Boolean,
        reserve_price: Int,
        is_buyout_price: Boolean,
        is_buyout_price_display: Boolean,
        buyout_price: Int,
        createdAt: Date,
        updatedAt: Date
    }

    type AuctionsList {
        auctions:[AuctionSchema],
    }

    input UpdateAuctionInput {
        id: String,
        key: String,
        name: String,
        product_id: String,
        status: Boolean,
        start_date: String,
        end_date: String,
        start_price: Int,
        bid_increment: Int,
        end_price: Int,
        is_reverse_price: Boolean,
        is_reverse_price_display: Boolean,
        reserve_price: Int,
        is_buyout_price: Boolean,
        is_buyout_price_display: Boolean,
        buyout_price: Int,
    }

    input CreateAuctionInput{
        id: String,
        key: String,
        name: String,
        product_id: String,
        status: Boolean,
        start_date: String,
        end_date: String,
        start_price: Int,
        bid_increment: Int,
        end_price: Int,
        is_reverse_price: Boolean,
        is_reverse_price_display: Boolean,
        reserve_price: Int,
        is_buyout_price: Boolean,
        is_buyout_price_display: Boolean,
        buyout_price: Int,
    }

    type Query {
        hello: String
        getAuction(input: GetAuctionInput): AuctionSchema
        getAuctions(input: GetAuctionsListInput): [AuctionSchema]
    }

    type Mutation {
        updateAuction(input: UpdateAuctionInput): AuctionSchema
        createAuction(input: CreateAuctionInput): AuctionSchema
    }
`)
