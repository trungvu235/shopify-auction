import {gql} from "@apollo/client";

export const UPDATE_EARN_POINT = gql`
    mutation UpdateEarnPoint($input : UpdateEarnPointInput) {
        updateEarnPoint(input : $input) {
            id
            key
            name
            reward_points
            limit
            requirement
            status
            createdAt
            updatedAt
        }
    }
`;

export const CREATE_AUCTION = gql`
    mutation UpdateEarnPoint($input : UpdateEarnPointInput) {
        updateEarnPoint(input : $input) {
            id
            key
            name
            reward_points
            limit
            requirement
            status
            createdAt
            updatedAt
        }
    }
`;


export const UPDATE_AUCTION = gql`
    mutation UpdateEarnPoint($input : UpdateEarnPointInput) {
        updateEarnPoint(input : $input) {
            id
            key
            name
            reward_points
            limit
            requirement
            status
            createdAt
            updatedAt
        }
    }
`;
