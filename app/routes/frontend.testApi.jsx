// import { cors } from 'remix-utils/cors'
import {authenticate} from "../shopify.server";
import axios from "axios";
import {useQuery} from "@apollo/client";
import {GET_AUCTIONS, GET_AUCTION} from "../graphql/query";
import client from "../graphql/client";
import {json} from "@remix-run/node";

export async function loader({request}) {
    const {session} = await authenticate.public.appProxy(request);
    let store = await axios.get(
        `https://${session.shop}/admin/api/2024-04/shop.json`,
        {
            headers: {
                "X-Shopify-Access-Token": session.accessToken,
                "Accept-Encoding": "application/json",
            },
        }
    );
    console.log(store.data.shop.id);

    const response = await client.query({
        query: GET_AUCTIONS,
        variables: {
            input: {
                id: `${store.data.shop.id}`
            }
        },
        fetchPolicy: "no-cache"
    })

    console.log('Frontend Fetch: ',response.data.getAuctions);

    return {response};
}

