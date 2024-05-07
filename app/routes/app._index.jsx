import {json} from "@remix-run/node";
import {
    useLoaderData,
} from "@remix-run/react";
import {
    Card,
    Grid,
    Box,
    Text,
    BlockStack,
    Page,
    InlineStack,
    Button,
    Icon
} from "@shopify/polaris";
import {authenticate} from "../shopify.server";
import axios from "axios";
import {useNavigate} from "@remix-run/react";
import {ProductIcon, OrderIcon} from "@shopify/polaris-icons";
import React from "react";

export const loader = async ({request}) => {
    const {session} = await authenticate.admin(request);
    let store = await axios.get(
        `https://${session.shop}/admin/api/2024-04/shop.json`,
        {
            headers: {
                "X-Shopify-Access-Token": session.accessToken,
                "Accept-Encoding": "application/json",
            },
        }
    );
    store = store.data.shop;


    return json({shop: store});
};

export default function Index() {
    const {shop} = useLoaderData();
    //
    // useEffect(() => {
    //     window.storeData = shop;
    // }, [shop])
    const navigate = useNavigate();

    return (
        <Page
            title="Dashboard"
            primaryAction={{
                content: 'Create Auction',
                disabled: false,
                onAction: () => {
                    navigate('../app/auction/create');
                },
            }}
        >
            <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 8}}>
                    <Card>
                        <Box paddingBlockStart="500" paddingBlockEnd="1600" paddingInlineStart="0" paddingInlineEnd="0">
                            <BlockStack inlineAlign="center">
                                <img
                                    src={"https://app.auctionplusapp.com/images/emptystate-product.png"}
                                    alt={"a sheet with purple and orange stripes"}
                                    style={{maxWidth: "250px"}}
                                />
                                <Box maxWidth="400px">
                                    <BlockStack align="center">
                                        <Box paddingBlockEnd="400">
                                            <Box paddingBlockEnd="150">
                                                <Text as="h2" variant="headingMd" fontWeight="bold" alignment="center">
                                                    You have 1 running auction
                                                </Text>
                                            </Box>
                                            <InlineStack align="center" gap="500" wrap={false}>
                                                <Button variant="primary" onClick={() => navigate('../app/auctions')}>
                                                    View Auctions
                                                </Button>
                                            </InlineStack>
                                        </Box>
                                    </BlockStack>
                                </Box>
                            </BlockStack>
                        </Box>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 4}}>
                    <div>
                        <Card sectioned>
                            <BlockStack gap="300">
                                <BlockStack inlineAlign="start" gap="200">
                                    <InlineStack gap="400">
                                        <Icon source={ProductIcon}/>
                                        <Text as="h2" variant="headingSm">Auction Details</Text>
                                    </InlineStack>
                                </BlockStack>
                                <BlockStack inlineAlign="center">
                                    <InlineStack gap="500" wrap={false}>
                                        <BlockStack>
                                            <Text variant="subdued">TOTAL NUMBER OF AUCTIONS</Text>
                                            <Text variant="headingXl" fontWeight="bold" alignment="center">6</Text>
                                        </BlockStack>
                                    </InlineStack>
                                    <p>View a summary of your online store’s orders.</p>
                                </BlockStack>
                                <BlockStack inlineAlign="center">
                                    <InlineStack gap="500" wrap={false}>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold" alignment="center">1</Text>
                                                <Text as="h2" variant="subdued">ACTIVE</Text>
                                            </BlockStack>
                                        </Box>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold" alignment="center">2</Text>
                                                <Text as="h2" variant="subdued">SCHEDULED</Text>
                                            </BlockStack>
                                        </Box>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold" alignment="center">3</Text>
                                                <Text as="h2" variant="subdued">COMPLETED</Text>
                                            </BlockStack>
                                        </Box>
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>

                        </Card>
                    </div>
                    <div style={{marginTop: "10px"}}>
                        <Card sectioned>
                            <BlockStack gap="300">
                                <BlockStack inlineAlign="start" gap="200">
                                    <InlineStack gap="400">
                                        <Icon source={OrderIcon}/>
                                        <Text as="h2" variant="headingSm">Order Details</Text>
                                    </InlineStack>
                                </BlockStack>
                                <BlockStack inlineAlign="center">
                                    <InlineStack gap="500" wrap={false}>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold" alignment="center">0</Text>
                                                <Text as="h2" variant="subdued">PAID</Text>
                                            </BlockStack>
                                        </Box>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold" alignment="center">0</Text>
                                                <Text as="h2" variant="subdued">UNFULFILLED</Text>
                                            </BlockStack>
                                        </Box>
                                    </InlineStack>
                                </BlockStack>
                            </BlockStack>
                        </Card>
                    </div>
                </Grid.Cell>
            </Grid>
        </Page>
    );
}
