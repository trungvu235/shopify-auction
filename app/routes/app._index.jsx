import {json} from "@remix-run/node";
import {
    useLoaderData,
} from "@remix-run/react";
import {
    Card, InlineGrid, Grid, CalloutCard, Bleed, Box, Image, Text, BlockStack, Page, LegacyCard, InlineStack, Button
} from "@shopify/polaris";

import {authenticate} from "../shopify.server";
import axios from "axios";
import PointModel from "../models/point.model";
import EarnPointModel from "../models/earnPoint.model";
import {forEach} from "lodash";

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

    const StoreID = await PointModel.exists({id: store.id});
    if (!StoreID) {
        const earn_point_default = [
            {
                id: store.id,
                key: 'Order',
                type: 0,
                name: 'Complete an order',
                reward_points: 100,
                requirement: null,
                limit: 0,
                status: true,
            },
            {
                id: store.id,
                key: 'FB_Share',
                type: 0,
                name: 'Share on Facebook',
                reward_points: 100,
                requirement: null,
                limit: 0,
                status: false,
            },
            {
                id: store.id,
                key: 'DoB',
                type: 0,
                name: 'Happy Birthday',
                reward_points: 100,
                requirement: null,
                limit: 0,
                status: false,
            },
            {
                id: store.id,
                key: 'SignIn',
                type: 0,
                name: 'Sign In',
                reward_points: 100,
                requirement: null,
                limit: 0,
                status: false,
            }
        ];
        await PointModel.create({
            id: store.id,
            point_currency: {
                singular: 'point',
                plural: 'points',
            },
            status: true,
        })
        forEach(earn_point_default, async (value) => {
            await EarnPointModel.create(value)
        })
    }

    return json({shop: store});
};

const Placeholder = ({height = 'auto', width = 'auto'}) => {
    return (
        <div
            style={{
                display: 'inherit',
                background: 'var(--p-color-text-info)',
                height: height ?? undefined,
                width: width ?? undefined,
            }}
        />
    );
};
export default function Index() {
    const {shop} = useLoaderData();
    //
    // useEffect(() => {
    //     window.storeData = shop;
    // }, [shop])


    return (
        <Page
            title="Dashboard"
            primaryAction={{content: 'Create Auction', disabled: false}}
        >
            {/*<InlineGrid gap="400" columns={3}>*/}
            {/*    <Placeholder height="320px"/>*/}
            {/*    <Placeholder height="320px"/>*/}
            {/*    <Placeholder height="320px"/>*/}
            {/*</InlineGrid>*/}
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
                                                <Text variant="headingMd" fontWeight="bold" alignment="center">
                                                    You have 1 running auction
                                                </Text>
                                            </Box>
                                            <InlineStack align="center" gap="500" wrap={false}>
                                                <Button variant="primary">View Auctions</Button>
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
                        <LegacyCard title="Auction Details" sectioned>
                            <BlockStack inlineAlign="center">
                                <InlineStack gap="500" wrap={false}>
                                    <BlockStack>
                                        <Text variant="subdued">TOTAL NUMBER OF AUCTIONS</Text>
                                        <Text variant="headingXl" fontWeight="bold" alignment="center">6</Text>
                                    </BlockStack>
                                </InlineStack>
                            </BlockStack>
                            <p>View a summary of your online store’s orders.</p>
                            <BlockStack inlineAlign="center">
                                <InlineStack gap="500" wrap={false}>
                                    <Box>
                                        <BlockStack>
                                            <Text variant="headingXl" fontWeight="bold" alignment="center">1</Text>
                                            <Text variant="subdued">ACTIVE</Text>
                                        </BlockStack>
                                    </Box>
                                    <Box>
                                        <BlockStack>
                                            <Text variant="headingXl" fontWeight="bold" alignment="center">2</Text>
                                            <Text variant="subdued">SCHEDULED</Text>
                                        </BlockStack>
                                    </Box>
                                    <Box>
                                        <BlockStack>
                                            <Text variant="headingXl" fontWeight="bold" alignment="center">3</Text>
                                            <Text variant="subdued">COMPLETED</Text>
                                        </BlockStack>
                                    </Box>
                                </InlineStack>
                            </BlockStack>
                        </LegacyCard>
                    </div>
                    <div style={{marginTop: "10px"}}>
                        <LegacyCard title="Order Details" sectioned>
                            <BlockStack inlineAlign="center">
                                <InlineStack gap="500" wrap={false}>
                                    <Box>
                                        <BlockStack>
                                            <Text variant="headingXl" fontWeight="bold" alignment="center">0</Text>
                                            <Text variant="subdued">PAID</Text>
                                        </BlockStack>
                                    </Box>
                                    <Box>
                                        <BlockStack>
                                            <Text variant="headingXl" fontWeight="bold" alignment="center">0</Text>
                                            <Text variant="subdued">UNFULFILLED</Text>
                                        </BlockStack>
                                    </Box>
                                </InlineStack>
                            </BlockStack>
                        </LegacyCard>
                    </div>
                </Grid.Cell>
            </Grid>
        </Page>
    );
}
