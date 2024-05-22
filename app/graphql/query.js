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
            auction_thumbnail
            winner_id
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
    query GetAuctions($input : GetAuctionsListInput) {
        getAuctions(input: $input) {
            id
            key
            name
            product_id
            auction_thumbnail
            winner_id
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

export const GET_ACTIVE_AUCTIONS = gql`
    query GetActiveAuctions($input : GetAuctionsListInput) {
        getActiveAuctions(input: $input) {
            id
            key
            name
            product_id
            auction_thumbnail
            winner_id
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
export const GET_SCHEDULED_AUCTIONS = gql`
    query GetScheduledAuctions($input : GetAuctionsListInput) {
        getScheduledAuctions(input: $input) {
            id
            key
            name
            product_id
            auction_thumbnail
            winner_id
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
export const GET_AUCTIONS_BY_CUSTOMER = gql`
    query GetAuctionsByCustomer($input : GetAuctionsByCustomerInput) {
        getAuctionsByCustomer(input: $input) {
            id
            key
            name
            product_id
            auction_thumbnail
            winner_id
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
