import React, {useState, useEffect} from 'react';
import {
    BlockStack,
    Card,
    DescriptionList,
    InlineStack,
    Layout,
    Link,
    Page,
    ResourceItem,
    ResourceList,
    Text,
    Icon,
    Thumbnail,
    Box, ButtonGroup, Button, InlineGrid
} from '@shopify/polaris';
import {useLoaderData, useNavigate, useFetcher} from '@remix-run/react';
import {ExternalIcon, ImageIcon, CheckIcon} from '@shopify/polaris-icons';
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";
import Countdown from 'react-countdown';
import {useQuery} from "@apollo/client";
import {GET_AUCTION} from "../graphql/query";
import ReactLoading from "react-loading";
import PageNotFound from "../components/layout/PageNotFound";

export const loader = async ({request, params}) => {
    const {session} = await authenticate.admin(request);

    let store = await axios.get(`https://${session.shop}/admin/api/2024-04/shop.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken, "Accept-Encoding": "application/json",
        },
    });
    store = store.data.shop;

    return json({session: session, shop: store, key: params.id});
}

export default function AuctionForm() {
    const customer = {
        "id": 7767143973182,
        "email": "vuthanhtrung23052001@gmail.com",
        "created_at": "2024-04-01T13:41:23-04:00",
        "updated_at": "2024-04-01T13:41:23-04:00",
        "first_name": "trung",
        "last_name": "vu",
        "orders_count": 1,
        "state": "disabled",
        "total_spent": "199.65",
        "last_order_id": 450789469,
        "note": null,
        "verified_email": true,
        "multipass_identifier": null,
        "tax_exempt": false,
        "tags": "Léon, Noël",
        "last_order_name": "#1001",
        "currency": "USD",
        "phone": "+16136120707",
        "addresses": [
            {
                "id": 7767143973182,
                "customer_id": 7767143973182,
                "first_name": null,
                "last_name": null,
                "company": null,
                "address1": "Chestnut Street 92",
                "address2": "",
                "city": "Louisville",
                "province": "Kentucky",
                "country": "United States",
                "zip": "40202",
                "phone": "555-625-1199",
                "name": "",
                "province_code": "KY",
                "country_code": "US",
                "country_name": "United States",
                "default": true
            }
        ],
        "tax_exemptions": [],
        "email_marketing_consent": {
            "state": "not_subscribed",
            "opt_in_level": null,
            "consent_updated_at": "2004-06-13T11:57:11-04:00"
        },
        "sms_marketing_consent": {
            "state": "not_subscribed",
            "opt_in_level": "single_opt_in",
            "consent_updated_at": "2024-04-01T13:41:23-04:00",
            "consent_collected_from": "OTHER"
        },
        "admin_graphql_api_id": "gid://shopify/Customer/207119551",
        "default_address": {
            "id": 7767143973182,
            "customer_id": 7767143973182,
            "first_name": null,
            "last_name": null,
            "company": null,
            "address1": "Chestnut Street 92",
            "address2": "",
            "city": "Louisville",
            "province": "Kentucky",
            "country": "United States",
            "zip": "40202",
            "phone": "555-625-1199",
            "name": "",
            "province_code": "KY",
            "country_code": "US",
            "country_name": "United States",
            "default": true
        }
    };

    const navigate = useNavigate();
    const fetcher = useFetcher();
    const {session, shop, key} = useLoaderData();
    const [auctionDetail, setAuctionDetail] = useState(null);
    const [productData, setProductData] = useState(null);
    const [loadingPage, setLoadingPage] = useState(true);

    const {loading: auctionsQueryLoading, data: auctionsQuery, error: dataError} = useQuery(GET_AUCTION, {
        variables: {
            input: {
                id: `${shop.id}`, key: `${key}`
            }
        },
        onCompleted: data => {
            setLoadingPage(false);
            if (dataError) {
                console.log(dataError);
            } else {
                setAuctionDetail(auctionsQuery.getAuction);
            }
        },
    });

    useEffect(() => {
        if (auctionDetail) {
            console.log(auctionDetail);
            fetcher.load(`../../api/product?product=${auctionDetail.product_id}`);
        }
    }, [auctionDetail]);

    useEffect(() => {
        if (fetcher.data) {
            setProductData(fetcher.data);
        }
    }, [fetcher.data]);

    const endTime = auctionDetail ? new Date(auctionDetail.end_date) : new Date(null);
    const startTime = auctionDetail ? new Date(auctionDetail.start_date) : new Date(null);
    const timeRemaining = endTime.getTime() - Date.now();
    const startIn = startTime.getTime() - Date.now();

    const Completionist = () => <span>The auction was finished</span>;
    const StartedMessage = () => <span>The auction has started. Please refresh the page.</span>;

    const renderer = ({days, hours, minutes, seconds, completed}) => {
        if (completed) {
            return <Completionist/>;
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
        <>
            {auctionDetail ? (
                <Page
                    title={auctionDetail ? auctionDetail.name : ''}
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
                        onAction: () => {
                            navigate('../auction/edit/' + key);
                        },
                    }}
                    actionGroups={
                        [
                            {
                                title: 'More actions',
                                actions: [
                                    {
                                        content: 'Stop auction',
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
                                            const url = `https://${shop.domain}/products/${productData.product.handle}`;
                                            window.open(url, '_blank');
                                        },
                                    },
                                    {
                                        content: 'Edit product',
                                        icon: ExternalIcon,
                                        onAction: () => {
                                            const url = 'https://admin.shopify.com/store/' + shop.name + '/products/' + auctionDetail.product_id;
                                            window.open(url, '_blank');
                                        },
                                    }
                                ],
                            },
                        ]
                    }
                >
                    <div style={{marginBottom: '10px'}}>
                        <Box background="bg-surface">
                            <BlockStack>
                                <Box background="bg-fill-success" borderRadius="100">
                                    <div style={{'padding': '10px 20px', 'color': '#fff'}}>
                                        <BlockStack inlineAlign="start" gap="200">
                                            <InlineStack gap="200">
                                                <Icon
                                                    source={CheckIcon}
                                                    tone="inherit"
                                                />
                                                <Text as="h3" variant="headingMd">This auction has sold</Text>
                                            </InlineStack>
                                        </BlockStack>
                                    </div>
                                </Box>
                                <Box background="bg-surface" borderRadius="100">
                                    <div style={{'padding': '10px 20px'}}>
                                        <BlockStack gap="100" inlineAlign="start" gap="200">
                                            <Text as="p" variant="bodyLg">
                                                <div style={{display:'flex'}}>
                                                    Customer
                                                    <a style={{display:'flex', color: 'rgba(0, 91, 211, 1)', marginLeft:'2px'}}
                                                       href={'https://admin.shopify.com/store/' + shop.name + '/customers/' + customer.id}
                                                       target="_blank">
                                                        {` ${customer.first_name} ${customer.last_name} `}
                                                        <Icon
                                                            source={ExternalIcon}
                                                            tone="base"
                                                        />
                                                    </a>
                                                    won the auction with a bid of $100
                                                </div>
                                            </Text>
                                        </BlockStack>
                                    </div>
                                </Box>
                            </BlockStack>
                        </Box>
                    </div>
                    {!auctionsQueryLoading && (
                        <Layout>
                            <Layout.Section>
                                <Card roundedAbove="sm">
                                    <BlockStack inlineAlign="start" gap="200">
                                        <Text as="h2" variant="headingMd">Auction information</Text>
                                    </BlockStack>
                                    {productData && (
                                        <ResourceList
                                            items={[productData.product]}
                                            renderItem={(item) => {

                                                return (
                                                    <ResourceItem
                                                        id={item.productId}
                                                        media={
                                                            item.image ? (
                                                                <Thumbnail
                                                                    source={item.image.src || ""}
                                                                    alt={item.image.alt}
                                                                />
                                                            ) : (
                                                                <Card>
                                                                    <Icon
                                                                        source={ImageIcon}
                                                                        tone="base"
                                                                    />
                                                                </Card>
                                                            )
                                                        }
                                                    >
                                                        <div>
                                                            <BlockStack>
                                                                <Text as="h2" variant="headingMd">
                                                                    <Link
                                                                        url={'https://' + shop.domain + '/products/' + item.handle}
                                                                        target='_blank'>
                                                                        {item.title}
                                                                    </Link>
                                                                </Text>
                                                                <span
                                                                    style={{fontSize: '14px'}}>Vendor: {item.vendor}</span>
                                                            </BlockStack>

                                                        </div>
                                                    </ResourceItem>
                                                );
                                            }
                                            }
                                        />
                                    )}
                                    {auctionDetail && (
                                        <DescriptionList
                                            items={[
                                                {
                                                    term: 'Auction ID',
                                                    description: '#' + auctionDetail.key,
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
                                                    description: auctionDetail.end_price ? auctionDetail.end_price + ' ' + shop.currency : 'This auction has not yet been bid',
                                                },
                                                {
                                                    term: 'Reserve Price',
                                                    description: auctionDetail.reserve_price ? auctionDetail.reserve_price + ' ' + shop.currency : '',
                                                },
                                                {
                                                    term: 'Buyout Price',
                                                    description: auctionDetail.buyout_price ? auctionDetail.buyout_price + ' ' + shop.currency : '',
                                                },
                                                {
                                                    term: 'Created at',
                                                    description: auctionDetail.createdAt ? new Date(auctionDetail.createdAt).toLocaleString() : '',
                                                },
                                            ]}
                                        />
                                    )}
                                </Card>
                            </Layout.Section>
                            <Layout.Section variant="oneThird" gap="200">
                                <div>
                                    <Card>
                                        {auctionDetail && startTime < Date.now() && (
                                            <BlockStack gap="200">
                                                <Text as="h2" variant="headingMd">Time remain</Text>
                                                <div style={{
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: '15px 0',
                                                }}>
                                                    <Countdown date={Date.now() + timeRemaining} renderer={renderer}>
                                                        <Completionist/>
                                                    </Countdown>
                                                </div>
                                            </BlockStack>
                                        )}
                                        {auctionDetail && startTime > Date.now() && (
                                            <BlockStack gap="200">
                                                <Text as="h2" variant="headingMd">Start in</Text>
                                                <div style={{
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: '15px 0',
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
                                            <div style={{width: '100%'}}>
                                                {auctionDetail && (
                                                    <BlockStack gap="300">
                                                        <InlineStack gap="1000" align="center">
                                                            <BlockStack>
                                                                <Text variant="subdued">START PRICE</Text>
                                                                <Text variant="headingLg" fontWeight="bold"
                                                                      alignment="center">
                                                                    {auctionDetail.start_price} {shop.currency}
                                                                </Text>
                                                            </BlockStack>
                                                            <BlockStack>
                                                                <Text variant="subdued">BID INCREMENT</Text>
                                                                <Text variant="headingLg" fontWeight="bold"
                                                                      alignment="center">
                                                                    {auctionDetail.bid_increment} {shop.currency}
                                                                </Text>
                                                            </BlockStack>
                                                        </InlineStack>
                                                        <InlineStack gap="1000" align="center">
                                                            <BlockStack>
                                                                <Text variant="subdued">CURRENT BIDS</Text>
                                                                <Text variant="headingLg" fontWeight="bold"
                                                                      alignment="center">
                                                                    {auctionDetail.end_price ? auctionDetail.end_price + shop.currency : '0'}
                                                                </Text>
                                                            </BlockStack>
                                                        </InlineStack>
                                                    </BlockStack>
                                                )}
                                            </div>
                                        </BlockStack>
                                    </Card>
                                </div>
                            </Layout.Section>
                        </Layout>
                    )}
                </Page>
            ) : (
                <>
                    {loadingPage && (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <ReactLoading type="spin" color="#000"/>
                        </div>
                    )}
                    {!loadingPage && (
                        <PageNotFound/>
                    )}
                </>
            )
            }
        </>
    )
        ;
}
