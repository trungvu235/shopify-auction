// import { cors } from 'remix-utils/cors'
import {authenticate} from "../shopify.server";
import axios from "axios";
import {GET_AUCTION, GET_AUCTIONS_BY_CUSTOMER} from "../graphql/query";
import client from "../graphql/client";
import {json} from "@remix-run/node";

export async function loader({request}) {
    const {session, admin} = await authenticate.public.appProxy(request);
    const url = new URL(request.url);
    const winnerId = url.searchParams.get("winner");
    let store = await axios.get(
        `https://${session.shop}/admin/api/2024-04/shop.json`,
        {
            headers: {
                "X-Shopify-Access-Token": session.accessToken,
                "Accept-Encoding": "application/json",
            },
        }
    );

    let response = await client.query({
        query: GET_AUCTIONS_BY_CUSTOMER,
        variables: {
            input: {
                id: `${store.data.shop.id}`,
                winner_id: `${winnerId}`
            }
        },
        fetchPolicy: "no-cache"
    })
    response = response.data.getAuctionsByCustomer;

    return json({customerAuctions: response});
}

