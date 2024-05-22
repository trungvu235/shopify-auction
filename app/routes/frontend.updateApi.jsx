// import { cors } from 'remix-utils/cors'
import {authenticate} from "../shopify.server";
import axios from "axios";
import {GET_SCHEDULED_AUCTIONS} from "../graphql/query";
import {UPDATE_AUCTION} from "../graphql/mutation";
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

    try {
        const response = await client.mutate({
            mutation: UPDATE_AUCTION,
            variables: {
                input: {
                    id: body.store_id,
                    key: body.key,
                    name: body.name,
                }
            }
        })
        if(response.data.updateAuction) {
            return json({
                action: 'success'
            })
        } else {
            return json({
                action : 'failed',
                error: 'MongoDB error'
            });
        }
    } catch (error) {
        console.error(error);

        return json({
            action : 'failed',
            error: error
        });
    }
}

