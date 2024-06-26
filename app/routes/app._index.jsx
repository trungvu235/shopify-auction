import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import { Card, Grid, Box, Text, BlockStack, Page, InlineStack, Button, Icon, IndexTable, useBreakpoints, Badge, Link }
    from "@shopify/polaris";
import {authenticate} from "../shopify.server";
import axios from "axios";
import {useNavigate} from "@remix-run/react";
import {ProductIcon, OrderIcon, ViewIcon} from "@shopify/polaris-icons";
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
    const [auctionsList, setAuctionsList] = useState([]);
    const [unsolvedList, setUnsolvedList] = useState([]);

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
    });

    const [totalActive, setTotalActive] = useState(0);
    const [totalScheduled, setTotalScheduled] = useState(0);
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalVerified, setTotalVerified] = useState(0);
    const [totalRejected, setTotalRejected] = useState(0);

    useEffect(() => {
        if (auctionsList) {
            let activeCount = 0;
            let scheduledCount = 0;
            let completedCount = 0;
            let rejectedCount = 0;
            let verifiedCount = 0;
            const unsolvedAuctions = [];

            auctionsList.map(
                (
                    {
                        id, key, name, start_price, bid_increment, end_price, start_date, end_date, status, winner_id,
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
                        if (status === 'unsolved' && winner_id) {
                            unsolvedAuctions.push({
                                id, key, name, start_price, bid_increment, end_price, start_date, end_date, status, winner_id,
                            });
                        }
                    }
                    if(status === 'verified'){
                        verifiedCount += 1;
                    }else if(status === 'rejected'){
                        rejectedCount += 1;
                    }
                }
            );

            setTotalActive(activeCount);
            setTotalScheduled(scheduledCount);
            setTotalCompleted(completedCount);
            setTotalVerified(verifiedCount);
            setTotalRejected(rejectedCount);
            setUnsolvedList(unsolvedAuctions);
        }
    }, [auctionsList]);

    const rowMarkup = unsolvedList.slice(0, 8).map(
        (
            {id, key, name, start_price, bid_increment, end_price, start_date, end_date},
            index
        ) => {
            const endDate = new Date(end_date);

            return (
                <IndexTable.Row id={key} key={key} position={index}>
                    <IndexTable.Cell><span>{name}</span></IndexTable.Cell>
                    <IndexTable.Cell><span>${end_price}</span></IndexTable.Cell>
                    <IndexTable.Cell><span>{endDate.toLocaleString()}</span></IndexTable.Cell>
                    <IndexTable.Cell>
                        <Badge tone="attention">Unsolved</Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Button onClick={() => navigate('../app/auction/' + key)}>
                            <Icon
                                source={ViewIcon}
                                tone="base"
                            />
                        </Button>

                    </IndexTable.Cell>
                </IndexTable.Row>
            );
        }
    );
    const resourceName = {
        singular: 'unsolved auctions',
        plural: 'unsolved auctions',
    };

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
                        <InlineStack align="space-between">
                            <Text as="h6" variant="headingMd">Unsolved Auction</Text>
                            <Link url="/app/auctions">View all</Link>
                        </InlineStack>

                        <Box minHeight="400px" paddingBlockStart="500" paddingBlockEnd="1600" paddingInlineStart="0" paddingInlineEnd="0">
                            {unsolvedList && (
                                <IndexTable
                                    condensed={useBreakpoints().smDown}
                                    resourceName={resourceName}
                                    itemCount={unsolvedList.length}
                                    headings={[
                                        {title: 'Name'},
                                        {title: 'End Bids'},
                                        {title: 'End Date'},
                                        {title: 'Status'},
                                        {title: 'Actions', alignment: 'center'},
                                    ]}
                                    selectable={false}
                                >
                                    {rowMarkup}
                                </IndexTable>
                            )}
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
                                                      alignment="center">{totalVerified}</Text>
                                                <Text as="h2" variant="subdued">VERIFIED</Text>
                                            </BlockStack>
                                        </Box>
                                        <Box>
                                            <BlockStack>
                                                <Text as="h2" variant="headingXl" fontWeight="bold"
                                                      alignment="center">{totalRejected}</Text>
                                                <Text as="h2" variant="subdued">REJECTED</Text>
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
