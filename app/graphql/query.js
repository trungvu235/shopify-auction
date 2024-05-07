import {gql} from "@apollo/client";

export const HELLO_QUERY = gql`
    query hello {
        hello
    }
`;

export const GET_AUCTION = gql`
    query GetAuction($input : GetAuctionInput) {
        getAuction(input: $input) {
            id
            key
            name
            product_id
            status
            start_date
            end_date
            start_price
            bid_increment
            end_price
            is_reverse_price
            is_reverse_price_display
            reserve_price
            is_buyout_price
            is_buyout_price_display
            buyout_price
            createdAt
            updatedAt
        }
    }
`;
export const GET_AUCTIONS = gql`
    query GetAuctions($input : GetAuctionInput) {
        getAuctions(input: $input) {
            id
            key
            name
            product_id
            status
            start_date
            end_date
            start_price
            bid_increment
            end_price
            is_reverse_price
            is_reverse_price_display
            reserve_price
            is_buyout_price
            is_buyout_price_display
            buyout_price
            createdAt
            updatedAt
        }
    }
`;
