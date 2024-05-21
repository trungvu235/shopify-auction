import {gql} from "@apollo/client";

export const UPDATE_AUCTION = gql`
    mutation UpdateAuction($input : UpdateAuctionInput) {
        updateAuction(input : $input) {
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
export const CREATE_AUCTION = gql`
    mutation CreateAuction($input : CreateAuctionInput) {
        createAuction(input : $input) {
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
        }
    }
`;


