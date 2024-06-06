// import { cors } from 'remix-utils/cors'
import {authenticate} from "../shopify.server";
import axios from "axios";
import {GET_AUCTIONS} from "../graphql/query";
import client from "../graphql/client";

export async function loader({request}) {
    const {session} = await authenticate.public.appProxy(request);
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    let store = await axios.get(
        `https://${session.shop}/admin/api/2024-04/shop.json`,
        {
            headers: {
                "X-Shopify-Access-Token": session.accessToken,
                "Accept-Encoding": "application/json",
            },
        }
    );
    const response = await client.query({
        query: GET_AUCTIONS,
        variables: {
            input: {
                id: `${store.data.shop.id}`,
                key: id
            }
        },
        fetchPolicy: "no-cache"
    })

    return {response};
}

