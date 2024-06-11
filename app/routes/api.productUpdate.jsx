import {authenticate} from "../shopify.server";
import {json} from "@remix-run/node";
import axios from "axios";

export async function loader({request}) {
    const {session, admin} = await authenticate.admin(request);
    const url = new URL(request.url);
    const productId = url.searchParams.get("product");
    const winnerId = url.searchParams.get("winner")

    const input = {
        id: productId,
        tags: "auctions"
    };

    if (winnerId) {
        input.metafields = [
            {
                namespace: "product_auction",
                key: "winner_id",
                value: winnerId,
                type: "single_line_text_field"
            }
        ];
    }

    const response = await admin.graphql(
        `
        mutation($input: ProductInput!) {
            productUpdate(input: $input) {
                product {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }
        `, {
        variables: {
            input: input
        },
    });


    return true;
}
