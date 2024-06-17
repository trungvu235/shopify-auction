import {authenticate} from "../shopify.server";
import axios from "axios";
import {GET_AUCTION} from "../graphql/query";
import client from "../graphql/client";
import {json} from "@remix-run/node";

export async function loader({request}) {
    const {session, admin} = await authenticate.public.appProxy(request);
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
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
        query: GET_AUCTION,
        variables: {
            input: {
                id: `${store.data.shop.id}`,
                key: `${key}`
            }
        },
        fetchPolicy: "no-cache"
    })
    response = response.data.getAuction;
    let product = await axios.get(`https://${session.shop}/admin/api/2024-04/products/${response.product_id}.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Accept-Encoding": "application/json",
        }
    });

    let data, winnerData;
    if(response.winner_id){
        data = await admin.graphql
        (`
            #graphql
            query {
                customer(id: "gid://shopify/Customer/${response.winner_id}") {
                    displayName
                }
            }
        `);
        winnerData = await data.json();
    }

    return json({auctionDetail: response, product: product.data.product, winner: winnerData});
}

