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
import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {GET_AUCTIONS} from "../graphql/query";

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

    return json({session: session, shop: store});
};

export default function Index() {
    const {session, shop} = useLoaderData();
    const [auctionsList, setAuctionsList] = useState();
    //
    // useEffect(() => {
    //     window.storeData = shop;
    // }, [shop])
    const navigate = useNavigate();
    const {loading: auctionsQueryLoading, data: auctionsQuery, error: dataError} = useQuery(GET_AUCTIONS, {
        variables: {
            input: {
                id: `${shop.id}`
            }
        },
        onCompleted: data => {
            if (dataError) {
                console.log(dataError);
            } else {
                setAuctionsList(auctionsQuery.getAuctions);
            }
        },
    })

    const [totalActive, setTotalActive] = useState(0);
    const [totalScheduled, setTotalScheduled] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);
    useEffect(() => {
        if (auctionsList) {
            let activeCount = 0;
            let scheduledCount = 0;
            let completedCount = 0;
            auctionsList.map(
                (
                    {
                        id,
                        key,
                        name,
                        product_id,
                        start_date,
                        end_date,
                        start_price,
                        bid_increment,
                        end_price,
                        is_reverse_price,
                        is_reverse_price_display,
                        reserve_price,
                        is_buyout_price,
                        is_buyout_price_display,
                        buyout_price,
                    },
                    index
                ) => {
                    const startDate = new Date(start_date);
                    const endDate = new Date(end_date);
                    if (startDate > Date.now()) {
                        scheduledCount += 1;
                    } else if (startDate < Date.now() && endDate > Date.now()) {
                        activeCount += 1;
                    } else {
                        completedCount += 1;
                    }
                }
            );

            setTotalActive(activeCount);
            setTotalScheduled(scheduledCount);
            setTotalCompleted(completedCount);
        }
    }, [auctionsList]);


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
                                                    You have {totalActive} running {totalActive > 1 ? 'auctions' : 'auction'}
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
                                            <Text as="h3" variant="subdued">TOTAL NUMBER OF AUCTIONS</Text>
                                            {auctionsList && (
                                                <Text as="h3" variant="headingXl" fontWeight="bold" alignment="center">
                                                    {auctionsList.length}
                                                </Text>
                                            )}
                                        </BlockStack>
                                    </InlineStack>
                                    <p>View a summary of your online store’s orders.</p>
                                </BlockStack>
                                <BlockStack inlineAlign="center">
                                    <InlineStack gap="500" wrap={false}>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold"
                                                      alignment="center">{totalActive}</Text>
                                                <Text as="h2" variant="subdued">ACTIVE</Text>
                                            </BlockStack>
                                        </Box>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold"
                                                      alignment="center">{totalScheduled}</Text>
                                                <Text as="h2" variant="subdued">SCHEDULED</Text>
                                            </BlockStack>
                                        </Box>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold" alignment="center">
                                                    {totalCompleted}
                                                </Text>
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
                                                <Text as="h2" variant="headingXl" fontWeight="bold"
                                                      alignment="center">0</Text>
                                                <Text as="h2" variant="subdued">PAID</Text>
                                            </BlockStack>
                                        </Box>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold"
                                                      alignment="center">0</Text>
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
