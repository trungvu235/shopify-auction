import {authenticate} from "../shopify.server";
import {json} from "@remix-run/node";
import axios from "axios";

export async function loader({request}) {
    const {session, admin} = await authenticate.admin(request);
    const url = new URL(request.url);
    const productId = url.searchParams.get("product");
    const winnerId = url.searchParams.get("winner");
    let product = await axios.get(`https://${session.shop}/admin/api/2024-04/products/${productId}.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Accept-Encoding": "application/json",
        }
    });
    let response, data;
    if(winnerId){
        response = await admin.graphql
        (`
            #graphql
            query {
                customer(id: "gid://shopify/Customer/6896330375486") {
                    displayName
                }
            }
        `);
        data = await response.json();
    }

    return json({product: product.data.product, winner: data?.data?.customer});
}
