import {authenticate} from "../shopify.server";
import {json} from "@remix-run/node";
import axios from "axios";

export async function loader({request}) {
    const {session} = await authenticate.admin(request);
    const productId = "11052470370622";
    let product = await axios.get(`https://${session.shop}/admin/api/2024-04/products/${productId}.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Accept-Encoding": "application/json",
        }
    });

    return json({session: session, product: product.data.product});
}
