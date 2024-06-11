import {authenticate} from "../shopify.server";

export async function loader({request}) {
    const {session, admin} = await authenticate.admin(request);
    const url = new URL(request.url);
    const productId = url.searchParams.get("product");
    const productPrice = url.searchParams.get("price")
    const product = `gid://shopify/Product/${productId}`;
    const productResponse = await admin.graphql(`
    {
        product(id: "${product}") {
            variants(first: 15) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    }`);
    const productVariants = await productResponse.json()
    const variantIds = productVariants.data.product.variants.edges.map(edge => edge.node.id)
    const productVariantsInput = variantIds.map(variantId => ({
        id: variantId,
        price: parseFloat(productPrice),
    }));
    const response = await admin.graphql(`
        mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants {
              id
              price
            }
            userErrors {
              field
              message
            }
          }
        }
    `,
        {
            variables: {
                "productId": product,
                "variants": productVariantsInput
            },
        }
    );
    return true;
}
