import React, {useState, useEffect, useCallback} from 'react';
import {BlockStack, Card, DescriptionList, InlineStack, Layout, Link, Page, ResourceItem, ResourceList, Text, Icon,
    Thumbnail, Box, ButtonGroup, Button, Modal} from '@shopify/polaris';
import {useLoaderData, useNavigate, useFetcher} from '@remix-run/react';
import {ExternalIcon, ImageIcon, CheckIcon} from '@shopify/polaris-icons';
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";
import Countdown from 'react-countdown';
import {useQuery} from "@apollo/client";
import {GET_AUCTION, GET_CUSTOMERS_BY_AUCTION} from "../graphql/query";
import ReactLoading from "react-loading";
import PageNotFound from "../components/layout/PageNotFound";
import {UPDATE_AUCTION} from "../graphql/mutation";
import client from "../graphql/client";

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
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const fetcher2 = useFetcher();
    const fetcher3 = useFetcher();
    const {session, shop, key} = useLoaderData();
    const [auctionDetail, setAuctionDetail] = useState(null);
    const [productData, setProductData] = useState(null);
    const [winnerData, setWinnerData] = useState(null);
    const [loadingPage, setLoadingPage] = useState(true);
    const [customersList, setCustomersList] = useState([]);
    const [bidsModalActive, setBidsModalActive] = useState(false);

    const handleBidsModal = useCallback(() => setBidsModalActive(!bidsModalActive), [bidsModalActive]);
    const activator = <a style={{cursor: "pointer"}} onClick={handleBidsModal}>See all bids</a>;

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
    const {loading: customersQueryLoading, data: customersQuery, error: customersQueryError} = useQuery(GET_CUSTOMERS_BY_AUCTION, {
        variables: {
            input: {
                key: `${key}`
            }
        },
        onCompleted: data => {
            if (customersQueryError) {
                console.log(customersQueryError);
            } else {
                setCustomersList(customersQuery.getCustomersByAuction);
            }
        },
    });

    useEffect(() => {
        if (customersList) {
            console.log(customersList);
        }
    }, [customersList]);

    useEffect(() => {
        if (auctionDetail) {
            fetcher.load('../../api/product?product=' + auctionDetail.product_id
                + (auctionDetail.winner_id ? '&winner=' + auctionDetail.winner_id : ''));
        }
    }, [auctionDetail]);

    useEffect(() => {
        if (fetcher.data) {
            setProductData(fetcher.data);
            setWinnerData(fetcher.data.winner);
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
    const handleVerify = async () => {
        try {
            const responseUpdate = client.mutate({
                mutation: UPDATE_AUCTION,
                variables: {
                    input: {
                        id: auctionDetail.id,
                        key: auctionDetail.key,
                        status: 'verified'
                    }
                }
            });
            shopify.toast.show('Auction is verified');
            await fetcher2.load('../../api/productPriceUpdate?product=' + auctionDetail.product_id
                +  '&price=' + auctionDetail.end_price);
            await fetcher3.load(`../../api/productUpdate?product=gid://shopify/Product/${auctionDetail.product_id}&winner=${auctionDetail.winner_id}`);
            navigate(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async () => {
        try {
            const responseUpdate = client.mutate({
                mutation: UPDATE_AUCTION,
                variables: {
                    input: {
                        id: auctionDetail.id,
                        key: auctionDetail.key,
                        status: 'rejected'
                    }
                }
            });
            shopify.toast.show('Auction is rejected');
            navigate(0);
        } catch (error) {
            console.error(error);
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
                    {auctionDetail.winner_id && winnerData && new Date(auctionDetail.end_date) < Date.now() && (
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
                                        <div style={{padding: '10px 20px', display: 'flex', justifyContent: 'space-between'}}>
                                            <BlockStack inlineAlign="start" gap="200">
                                                <Text as="span" variant="bodyLg">
                                                    <div style={{display:'flex'}}>
                                                        Customer
                                                        <a style={{display:'flex', color: 'rgba(0, 91, 211, 1)', marginLeft:'2px'}}
                                                           href={'https://admin.shopify.com/store/' + shop.name + '/customers/' + auctionDetail.winner_id}
                                                           target="_blank">
                                                            {` ${winnerData.displayName} `}
                                                            <Icon
                                                                source={ExternalIcon}
                                                                tone="base"
                                                            />
                                                        </a>
                                                        won the auction with a bid of ${auctionDetail.end_price}
                                                    </div>
                                                </Text>
                                            </BlockStack>
                                            <div>
                                                {auctionDetail.status === 'unsolved' ? (
                                                    <ButtonGroup>
                                                        <Button variant="primary" onClick={handleVerify}>Verify</Button>
                                                        <Button onClick={handleReject}>Reject</Button>
                                                    </ButtonGroup>
                                                ) : (
                                                    <div>
                                                        This auction was {auctionDetail.status}!
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Box>
                                </BlockStack>
                            </Box>
                        </div>
                    )}

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
                                                term: 'Auction Type',
                                                description: auctionDetail.auction_type === 'live-auction' ? 'Live auction' : 'Reverse auction',
                                            },
                                            ...(auctionDetail.auction_type === 'live-auction' ? [
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
                                            ] : [])
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
                                        <div style={{display:'flex', justifyContent:'space-between', width: '100%'}}>
                                            <Text as="h2" variant="headingMd">Bid Details</Text>
                                            <Modal
                                                activator={activator}
                                                open={bidsModalActive}
                                                onClose={handleBidsModal}
                                                title="All bids"
                                                primaryAction={{
                                                    content: 'Close',
                                                    onAction: handleBidsModal,
                                                }}
                                            >
                                                <Modal.Section>
                                                    {customersList.length && (
                                                        <table style={{width:'100%'}}>
                                                            <thead>
                                                            <tr>
                                                                <th>Customer ID</th>
                                                                <th>Bid</th>
                                                                <th>Contact Number</th>
                                                                <th>Bid at</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                                {customersList.map((customer, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            <a
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    color: 'rgba(0, 91, 211, 1)',
                                                                                    marginLeft: '2px',
                                                                                    justifyContent: 'center',
                                                                                }}
                                                                                href={'https://admin.shopify.com/store/' + shop.name + '/customers/' + customer.id}
                                                                                target="_blank">
                                                                                #{customer.id}
                                                                            </a>
                                                                        </td>
                                                                        <td style={{textAlign: 'center'}}>${customer.bid}</td>
                                                                        <td style={{textAlign: 'center'}}>{customer.contact_number}</td>
                                                                        <td style={{textAlign: 'center'}}>{new Date(customer.updatedAt).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </Modal.Section>
                                            </Modal>
                                        </div>

                                        <div style={{width: '100%'}}>
                                        {auctionDetail && (
                                                <BlockStack gap="300">
                                                    <InlineStack gap="1000" align="center">
                                                        <BlockStack>
                                                            <Text as="h3" variant="subdued">START PRICE</Text>
                                                            <Text as="h3" variant="headingLg" fontWeight="bold"
                                                                  alignment="center">
                                                                {auctionDetail.start_price} {shop.currency}
                                                            </Text>
                                                        </BlockStack>
                                                        {auctionDetail.auction_type === 'live-auction' && (
                                                            <BlockStack>
                                                                <Text as="h3" variant="subdued">BID INCREMENT</Text>
                                                                <Text as="h3" variant="headingLg" fontWeight="bold"
                                                                      alignment="center">
                                                                    {auctionDetail.bid_increment} {shop.currency}
                                                                </Text>
                                                            </BlockStack>
                                                        )}
                                                    </InlineStack>
                                                    <InlineStack gap="1000" align="center">
                                                        {auctionDetail.auction_type ==='live-auction' && (
                                                            <BlockStack>
                                                                <Text as="h3" variant="subdued">CURRENT BID</Text>
                                                                <Text as="h3" variant="headingLg" fontWeight="bold"
                                                                      alignment="center">
                                                                    {auctionDetail.end_price ? auctionDetail.end_price + shop.currency : '0'}
                                                                </Text>
                                                            </BlockStack>
                                                        )}
                                                        {auctionDetail.auction_type ==='reverse-auction' && (
                                                            <BlockStack>
                                                                <Text as="h3" variant="subdued">TOTAL BIDS</Text>
                                                                <Text as="h3" variant="headingLg" fontWeight="bold"
                                                                      alignment="center">
                                                                    {customersList.length}
                                                                </Text>
                                                            </BlockStack>
                                                        )}
                                                    </InlineStack>
                                                </BlockStack>
                                            )}
                                        </div>
                                    </BlockStack>
                                </Card>
                            </div>
                        </Layout.Section>
                    </Layout>

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
