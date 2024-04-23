const {buildSchema} = require("graphql")

export const schema = buildSchema(`
    scalar JSON
    scalar Date

    input GetEarnPointInput {
        id: String,
        key: String
    }

    input GetPointProgramInput {
        id: String
    }

    input GetAuctionInput {
        id: String,
        key: String
    }


    input UpdateEarnPointInput{
        id: String,
        key: String,
        name: String,
        reward_points: Int,
        status: Boolean
    }

    type PointCurrencySchema {
        singular: String,
        plural: String
    }

    type EarnPointSchema {
        id: String,
        key: String,
        type: Int,
        name: String,
        reward_points: Int,
        limit: Int,
        requirement: JSON,
        status: Boolean,
        createdAt: Date,
        updatedAt: Date
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
    }

    type PointProgram {
        id: String,
        point_currency: PointCurrencySchema,
        status: Boolean
        createdAt: Date,
        updatedAt: Date
    }

    type Query {
        hello: String
        getEarnPoint(input: GetEarnPointInput): EarnPointSchema
        getEarnPoints(input: GetEarnPointInput): [EarnPointSchema]
        getPointProgram(input: GetPointProgramInput): PointProgram
        getAuction(input: GetAuctionInput): AuctionSchema
        getAuctions(input: GetAuctionInput): AuctionSchema
    }

    type Mutation {
        updateEarnPoint(input: UpdateEarnPointInput): EarnPointSchema
    }
`)
