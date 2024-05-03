import {useState, useCallback} from 'react';
import React from 'react';
import {
    Page,
    Card,
    Text,
    InlineStack,
    Layout,
    BlockStack,
    ResourceList,
    Thumbnail,
    ResourceItem,
    Link,
    DescriptionList
} from '@shopify/polaris';
import {useNavigate} from '@remix-run/react';
import { ExternalIcon } from '@shopify/polaris-icons';
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Countdown from 'react-countdown';

export const loader = async ({request}) => {
    const {session} = await authenticate.admin(request);
    const productId = "11052470370622";
    let products = await axios.get(`https://${session.shop}/admin/api/2024-04/products.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Accept-Encoding": "application/json",
        },
        params: {
            limit: 100
        }
    });
    let product = await axios.get(`https://${session.shop}/admin/api/2024-04/products/${productId}.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Accept-Encoding": "application/json",
        }
    });

    console.log(product);

    let store = await axios.get(`https://${session.shop}/admin/api/2024-04/shop.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken, "Accept-Encoding": "application/json",
        },
    });
    store = store.data.shop;
    console.log(store);

    return json({session: session, shop: store, product: product.data.product});
}

export default function AuctionForm() {
    const sampleAuction = {
        id: '1020',
        name: 'test auction',
        start_price: 100,
        bid_increment: 10,
        end_price: 150,
        product_id: '11052470370622',
        has_reserve_price: true,
        reserve_price_display: false,
        reserve_price: 300,
        has_buyout_price: false,
        buyout_price_display: false,
        buyout_price: null,
        start_date: "2024-04-04T18:21",
        end_date: "2024-05-10T16:21",
    };

    const navigate = useNavigate();
    const {session, shop, product} = useLoaderData();

    const [startDate, setStartDate] = useState(sampleAuction.start_date);
    const [endDate, setEndDate] = useState(sampleAuction.end_date);

    const Completionist = () => <span>The auction was finished</span>;
    const StartedMessage = () => <span>The auction has started. Please refresh the page.</span>;

    const endTime = new Date(endDate);
    const startTime = new Date(startDate);
    const timeRemaining = endTime.getTime() - Date.now();
    const startIn = startTime.getTime() - Date.now();
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return <Completionist />;
        } else {

            return (
                <InlineStack gap="300">
                    <BlockStack inlineAlign="center" gap="300">
                        <span>{days}</span>
                        <Text as='h2' tone='subdued' variant='bodyLg'>Days</Text>
                    </BlockStack>
                    <span>:</span>
                    <BlockStack inlineAlign="center" gap="300">
                        <span>{hours}</span>
                        <Text as='h2' tone='subdued' variant='bodyLg'>Hours</Text>
                    </BlockStack>
                    <span>:</span>
                    <BlockStack inlineAlign="center" gap="300">
                        <span>{minutes}</span>
                        <Text as='h2' tone='subdued' variant='bodyLg'>Minutes</Text>
                    </BlockStack>
                    <span>:</span>
                    <BlockStack inlineAlign="center" gap="300">
                        <span>{seconds}</span>
                        <Text as='h2' tone='subdued' variant='bodyLg'>Seconds</Text>
                    </BlockStack>
                </InlineStack>
            );
        }
    };

    return (
        <Page
            title={sampleAuction.name}
            backAction={
                {
                    content: 'Auctions',
                    onAction: () => {
                        navigate('../auctions');
                    },
                }
            }
            primaryAction={{
                content: 'Edit',
                disabled: false,
                onAction: () => {
                    navigate('../auction/edit/' + sampleAuction.id);
                },
            }}
            actionGroups=
            {[
                {
                    title: 'More actions',
                    actions: [
                        {
                            content: 'Cancel order',
                            destructive: true,
                            onAction: () => {
                                // handleCreateAuction();
                                // navigate('../auctions');
                            },
                        },
                        {
                            content: 'View product in store',
                            icon: ExternalIcon,
                            onAction: () => {
                                const url = 'https://${shop.domain}/products/${product.handle}';
                                window.open(url, '_blank');
                            },
                        },
                        {
                            content: 'Edit product',
                            icon: ExternalIcon,
                            onAction: () => {
                                const url ='https://admin.shopify.com/store/' + shop.name + '/products/' + sampleAuction.product_id;
                                window.open(url, '_blank');
                            },
                        }
                    ],
                },
            ]}
        >
            <Layout>
                <Layout.Section>
                    <Card roundedAbove="sm">
                        <BlockStack inlineAlign="start" gap="200">
                            <Text as="h2" variant="headingMd">Auction information</Text>
                        </BlockStack>
                        <ResourceList
                            items={[product]}
                            renderItem={(item) => {

                                return (
                                    <ResourceItem
                                        id={item.productId}
                                        media={
                                            <Thumbnail
                                                source={item.image.src || ""}
                                                alt={item.image.alt}
                                            />
                                        }
                                    >
                                        <div style={{display:'flex', justifyContent:'center'}}>
                                            <BlockStack>
                                                <Text as="h2" variant="headingMd">
                                                    <Link url={'https://' + shop.domain + '/products/' + item.handle} target='_blank'>
                                                        {item.title}
                                                    </Link>
                                                </Text>
                                                <span style={{fontSize: '14px'}}>Vendor: {item.vendor}</span>
                                            </BlockStack>

                                        </div>
                                    </ResourceItem>
                                );
                            }
                            }
                        />
                        <DescriptionList
                            items={[
                                {
                                    term: 'Auction ID',
                                    description: '#' + sampleAuction.id,
                                },
                                {
                                    term: 'Start Date',
                                    description: startTime.toLocaleString(),
                                },
                                {
                                    term: 'End Date',
                                    description: endTime.toLocaleString(),
                                },
                                {
                                    term: 'Current Bids',
                                    description: sampleAuction.end_price + ' ' + shop.currency,
                                },
                                {
                                    term: 'Reserve Price',
                                    description: sampleAuction.reserve_price ? sampleAuction.reserve_price + ' ' + shop.currency : '',
                                },
                                {
                                    term: 'Buyout Price',
                                    description: sampleAuction.has_buyout_price ? sampleAuction.buyout_price + ' ' + shop.currency : '',
                                },
                            ]}
                        />
                    </Card>
                </Layout.Section>
                <Layout.Section variant="oneThird" gap="200">
                    <div>
                        <Card>
                            {startTime < Date.now() && (
                                <BlockStack gap="200">
                                    <Text as="h2" variant="headingMd">Time remain</Text>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding:'15px 0',
                                    }}>
                                        <Countdown date={Date.now() + timeRemaining} renderer={renderer}>
                                            <Completionist/>
                                        </Countdown>
                                    </div>
                                </BlockStack>
                            )}
                            {startTime > Date.now() && (
                                <BlockStack gap="200">
                                    <Text as="h2" variant="headingMd">Start in</Text>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding:'15px 0',
                                    }}>
                                        <Countdown date={Date.now() + startIn} renderer={renderer}>
                                            <StartedMessage/>
                                        </Countdown>
                                    </div>
                                </BlockStack>
                            )}
                        </Card>
                    </div>
                    <div style={{marginTop: "10px"}}>
                        <Card>
                            <BlockStack inlineAlign="start" gap="200">
                                <Text as="h2" variant="headingMd">Bid Details</Text>
                                <div style={{width:'100%'}}>
                                    <BlockStack gap="300">
                                        <InlineStack gap="1000" align="center" >
                                            <BlockStack>
                                                <Text variant="subdued">START PRICE</Text>
                                                <Text variant="headingLg" fontWeight="bold" alignment="center">{sampleAuction.start_price} {shop.currency}</Text>
                                            </BlockStack>
                                            <BlockStack>
                                                <Text variant="subdued">BID INCREMENT</Text>
                                                <Text variant="headingLg" fontWeight="bold" alignment="center">{sampleAuction.bid_increment} {shop.currency}</Text>
                                            </BlockStack>
                                        </InlineStack>
                                        <InlineStack gap="1000" align="center" >
                                            <BlockStack>
                                                <Text variant="subdued">CURRENT BIDS</Text>
                                                <Text variant="headingLg" fontWeight="bold" alignment="center">{sampleAuction.end_price} {shop.currency}</Text>
                                            </BlockStack>
                                        </InlineStack>
                                    </BlockStack>
                                </div>
                            </BlockStack>
                        </Card>
                    </div>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
