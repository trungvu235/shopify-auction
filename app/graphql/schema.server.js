const {buildSchema} = require("graphql")

export const schema = buildSchema(`
    scalar JSON
    scalar Date

    input GetAuctionInput {
        id: String,
        key: String,
    }

    input GetBidsListInput {
        id: String,
    }

    input GetBidInput {
        id: String,
        key: String,
    }

    input GetAuctionsListInput {
        id: String,
        key: String,
    }

    input GetAuctionsByCustomerInput {
        id: String,
        winner_id: String,
    }

    type AuctionSchema {
        id: String,
        key: String,
        name: String,
        product_id: String,
        auction_thumbnail: String,
        winner_id: String,
        contact_number: String,
        status: String,
        start_date: String,
        end_date: String,
        start_price: Float,
        bid_increment: Float,
        end_price: Float,
        auction_type: String,
        is_reverse_price: Boolean,
        is_reverse_price_display: Boolean,
        reserve_price: Float,
        is_buyout_price: Boolean,
        is_buyout_price_display: Boolean,
        buyout_price: Float,
        createdAt: Date,
        updatedAt: Date
    }

    type BidSchema {
        id: String,
        key: String,
        bid: Float,
        contact_number: String,
    }

    type AuctionsList {
        auctions:[AuctionSchema],
    }

    type BidsList {
        bids:[BidSchema],
    }

    input UpdateAuctionInput {
        id: String,
        key: String,
        name: String,
        product_id: String,
        auction_thumbnail: String,
        winner_id: String,
        contact_number: String,
        status: String,
        start_date: String,
        end_date: String,
        start_price: Float,
        bid_increment: Float,
        end_price: Float,
        auction_type: String,
        is_reverse_price: Boolean,
        is_reverse_price_display: Boolean,
        reserve_price: Float,
        is_buyout_price: Boolean,
        is_buyout_price_display: Boolean,
        buyout_price: Float,
    }

    input CreateAuctionInput{
        id: String,
        key: String,
        name: String,
        product_id: String,
        auction_thumbnail: String,
        winner_id: String,
        contact_number: String,
        status: String,
        start_date: String,
        end_date: String,
        start_price: Float,
        bid_increment: Float,
        end_price: Float,
        auction_type: String,
        is_reverse_price: Boolean,
        is_reverse_price_display: Boolean,
        reserve_price: Float,
        is_buyout_price: Boolean,
        is_buyout_price_display: Boolean,
        buyout_price: Float,
    }

    input CreateBidInput{
        id: String,
        key: String,
        bid: Float,
        contact_number: String,
    }

    type Query {
        getAuction(input: GetAuctionInput): AuctionSchema
        getAuctions(input: GetAuctionsListInput): [AuctionSchema]
        getAuctionsByCustomer(input: GetAuctionsByCustomerInput): [AuctionSchema]
        getActiveAuctions(input: GetAuctionsListInput): [AuctionSchema]
        getScheduledAuctions(input: GetAuctionsListInput): [AuctionSchema]
        getUnsolvedAuctions(input: GetAuctionsListInput): [AuctionSchema]
        getBids(input: GetBidsListInput): [BidSchema]
        getBid(input: GetBidInput): BidSchema
    }

    type Mutation {
        updateAuction(input: UpdateAuctionInput): AuctionSchema
        createAuction(input: CreateAuctionInput): AuctionSchema
        createBid(input: CreateBidInput): BidSchema
    }
`)
