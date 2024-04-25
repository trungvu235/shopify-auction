import {useState, useCallback} from 'react';
import React from 'react';
import {
    Page,
    Card,
    Text,
    InlineStack,
    Icon,
    Button,
    Layout,
    BlockStack,
    TextField,
    Select,
    ResourceList,
    Thumbnail,
    ResourceItem,
    FormLayout,
    Checkbox,
    Pagination,
} from '@shopify/polaris';
import {useNavigate} from '@remix-run/react';
import {
    ProductIcon,
    CalendarIcon,
    SettingsIcon,
    ClockIcon
} from '@shopify/polaris-icons';
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";
import {
    useLoaderData,
} from "@remix-run/react";
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

    return json({session: session, shop: store, product: product.data.product});
}

export default function AuctionForm() {
    const sampleAuction = {
        id: '1020',
        name: 'test auction',
        start_price: 100,
        bid_increment: 10,
        product_id: '1020',
        has_reserve_price: false,
        reserve_price_display: false,
        has_buyout_price: false,
        buyout_price_display: false,
        start_date: "2024-04-10T16:21",
        end_date: "2024-04-27T16:21",
    };

    const navigate = useNavigate();
    const {session, shop, product} = useLoaderData();
    const [name, setName] = useState(sampleAuction.name);
    const [startPrice, setStartPrice] = useState(sampleAuction.start_price);
    const [bidIncrement, setBidIncrement] = useState(sampleAuction.bid_increment);
    const [selectValue, setSelectValue] = useState('fixed');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [reservePriceChecked, setReservePriceChecked] = useState(sampleAuction.has_reserve_price);
    const [reservePriceDisplay, setReservePriceDisplay] = useState(sampleAuction.reserve_price_display);
    const [reservePrice, setReservePrice] = useState(null);
    const [buyoutPriceChecked, setBuyoutPriceChecked] = useState(sampleAuction.has_buyout_price);
    const [buyoutPriceDisplay, setBuyoutPriceDisplay] = useState(sampleAuction.buyout_price_display);
    const [buyoutPrice, setBuyoutPrice] = useState(null);
    const placeholderText = selectValue === 'percentage' ? '% 0' : '$ 0';
    const [startDate, setStartDate] = useState(sampleAuction.start_date);
    const [endDate, setEndDate] = useState(sampleAuction.end_date);

    const handleStartDateChange = (value) => {
        setStartDate(value);
    };
    const handleEndDateChange = (value) => {
        setEndDate(value);
    };
    const handleNameChange = useCallback(
        (newValue) => setName(newValue),
        [],
    );
    const handleStartPriceChange = useCallback(
        (newValue) => setStartPrice(newValue),
        [],
    );
    const handleBidIncrementChange = useCallback(
        (value) => setBidIncrement(value),
        [],
    );
    const handleSelectChange = useCallback(
        (value) => setSelectValue(value),
        [],
    );
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const paginatedItems = selectedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handleReservePrice = useCallback(
        (newChecked) => setReservePriceChecked(newChecked),
        [],
    );
    const handleReservePriceDisplay = useCallback(
        (newChecked) => setReservePriceDisplay(newChecked),
        [],
    );
    const handleReservePriceChange = useCallback(
        (value) => setReservePrice(value),
        [],
    );
    const handleBuyoutPrice = useCallback(
        (newChecked) => setBuyoutPriceChecked(newChecked),
        [],
    );
    const handleBuyoutPriceDisplay = useCallback(
        (newChecked) => setBuyoutPriceDisplay(newChecked),
        [],
    );
    const handleBuyoutPriceChange = useCallback(
        (value) => setBuyoutPrice(value),
        [],
    );

    const handleCreateAuction = () => {
        const auction = {
            variables: {
                input: {
                    general: {
                        name: name,
                        start_price: startPrice,
                        bid_increment: bidIncrement,
                    },
                    selected_product: selectedProducts,
                    settings: {
                        has_reserve_price: reservePriceChecked,
                        reserve_price_display: reservePriceDisplay,
                        reserve_price: reservePrice,
                        has_buyout_price: buyoutPriceChecked,
                        buyout_price_display: buyoutPriceDisplay,
                        buyout_price: buyoutPrice,
                    },
                    active_dates: {
                        start_date: startDate,
                        end_date: endDate,
                    }
                }
            }
        };
        console.log(auction);
        console.log(product);
    };
    const Completionist = () => <span>You are good to go!</span>;
    const endTime = new Date(endDate);
    const startTime = new Date(startDate);
    const timeRemaining = endTime.getTime() - Date.now();
    const startIn = startTime.getTime() - Date.now();


    return (
        <Page
            title="Edit auctions"
            primaryAction={{
                content: 'Save',
                disabled: false,
                onAction: () => {
                    // navigate('../auctions');
                    handleCreateAuction();
                },
            }}
        >
            <Layout>
                <Layout.Section variant="oneThird" gap="200">
                    <div>
                        <Card>
                            <BlockStack gap="200">
                                <Text as="h2" variant="headingSm">
                                    General
                                </Text>
                                <TextField
                                    label="Name"
                                    value={name}
                                    onChange={handleNameChange}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="Start price"
                                    value={startPrice}
                                    onChange={handleStartPriceChange}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="Bid increment"
                                    type="number"
                                    value={bidIncrement}
                                    onChange={handleBidIncrementChange}
                                    autoComplete="off"
                                    placeholder={placeholderText}
                                    connectedRight={
                                        <Select
                                            value={selectValue}
                                            label="Bid increment options"
                                            onChange={handleSelectChange}
                                            labelHidden
                                            options={[
                                                {value: 'fixed', label: 'Fixed'},
                                                {value: 'percentage', label: 'Percentage'},
                                            ]}
                                        />
                                    }
                                />
                            </BlockStack>
                        </Card>
                    </div>
                    <div style={{marginTop: "10px"}}>
                        <Card>
                            <BlockStack inlineAlign="start" gap="200">
                                <InlineStack gap="400">
                                    <Icon
                                        source={CalendarIcon}
                                        tone="base"
                                    />
                                    <Text as="h2" variant="headingSm">
                                        Active dates
                                    </Text>
                                </InlineStack>

                                <BlockStack gap="300">
                                    <TextField
                                        label="Start at"
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        autoComplete="off"
                                    />
                                    <TextField
                                        label="End at"
                                        type="datetime-local"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        autoComplete="off"
                                    />
                                </BlockStack>


                            </BlockStack>
                        </Card>
                    </div>
                </Layout.Section>
                <Layout.Section>
                    <Card roundedAbove="sm">
                        <BlockStack inlineAlign="start" gap="200">
                            <InlineStack gap="400">
                                <Icon source={ProductIcon}/>
                                <Text as="h2" variant="headingSm">Selected products</Text>
                            </InlineStack>
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
                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                            {item.title}
                                        </Text>
                                        <span>Price: ${item.variants[0].price}</span>
                                    </ResourceItem>
                                );
                            }
                            }
                        />
                        <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                            {startTime < Date.now() && (
                                <div>
                                    <Text as="h2">Time remain:</Text>
                                    <Countdown date={Date.now() + timeRemaining}>
                                        <Completionist/>
                                    </Countdown>
                                </div>
                            )}
                            {startTime > Date.now() && (
                                <div>
                                    <Text as="h2">Start in:</Text>
                                    <Countdown date={Date.now() + startIn}>
                                        <Completionist/>
                                    </Countdown>
                                </div>
                            )}
                        </div>
                    </Card>
                    <div style={{marginTop: "10px"}}>
                        <Card roundedAbove="sm">
                            <BlockStack inlineAlign="start" gap="200">
                                <InlineStack gap="400">
                                    <Icon source={SettingsIcon} tone="base"/>
                                    <Text as="h2" variant="headingSm">Advanced settings</Text>
                                </InlineStack>
                            </BlockStack>
                            <FormLayout>
                                <FormLayout.Group>
                                    <BlockStack inlineAlign="start" gap="200">
                                        <div className="reserve-price" style={{display: "flex"}}>
                                            <div style={{marginRight: '10px'}}>
                                                <Checkbox
                                                    label="Reserve price"
                                                    helpText="No winning bidder if closing price is below reserve price."
                                                    checked={reservePriceChecked}
                                                    onChange={handleReservePrice}
                                                />
                                            </div>
                                            {reservePriceChecked && (
                                                <div style={{width: "45%"}}>
                                                    <Checkbox
                                                        label="Show on front store"
                                                        checked={reservePriceDisplay}
                                                        onChange={handleReservePriceDisplay}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {reservePriceChecked && (
                                            <TextField
                                                label="Reserve price"
                                                type="number"
                                                value={reservePrice}
                                                onChange={handleReservePriceChange}
                                                autoComplete="off"
                                                placeholder="$ 0"
                                            />
                                        )}
                                    </BlockStack>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <BlockStack inlineAlign="start" gap="200">
                                        <div className="buyout-price" style={{display: "flex"}}>
                                            <div style={{marginRight: '10px'}}>
                                                <Checkbox
                                                    label="Buyout price"
                                                    helpText="Automatically close the auction when a customer bids the buyout price."
                                                    checked={buyoutPriceChecked}
                                                    onChange={handleBuyoutPrice}
                                                />
                                            </div>
                                            {buyoutPriceChecked && (
                                                <div style={{width: "45%"}}>
                                                    <Checkbox
                                                        label="Show on front store"
                                                        checked={buyoutPriceDisplay}
                                                        onChange={handleBuyoutPriceDisplay}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {buyoutPriceChecked && (
                                            <TextField
                                                label="Buyout price"
                                                type="number"
                                                value={buyoutPrice}
                                                onChange={handleBuyoutPriceChange}
                                                autoComplete="off"
                                                placeholder="$ 0"
                                            />
                                        )}
                                    </BlockStack>
                                </FormLayout.Group>
                            </FormLayout>
                        </Card>
                    </div>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
