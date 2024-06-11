import {useState, useCallback, useEffect} from 'react';
import React from 'react';
import {
    Page,
    Card,
    Text,
    InlineStack,
    Icon,
    Layout,
    BlockStack,
    TextField,
    Select,
    ResourceList,
    Thumbnail,
    ResourceItem,
    FormLayout,
    Checkbox,
} from '@shopify/polaris';
import {useLoaderData, useNavigate, useFetcher} from '@remix-run/react';
import {
    ProductIcon,
    CalendarIcon,
    SettingsIcon,
    ExternalIcon,
    ImageIcon
} from '@shopify/polaris-icons';
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";
import {useQuery, useMutation} from "@apollo/client";
import {GET_AUCTION} from "../graphql/query";
import {UPDATE_AUCTION} from "../graphql/mutation";
import PageNotFound from "../components/layout/PageNotFound";
import ReactLoading from "react-loading";

export const loader = async ({request, params}) => {
    const {session, admin} = await authenticate.admin(request);

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
    const {session, shop, key} = useLoaderData();
    const [name, setName] = useState();
    const [startPrice, setStartPrice] = useState();
    const [bidIncrement, setBidIncrement] = useState();
    const [selectValue, setSelectValue] = useState('fixed');
    const [reservePriceChecked, setReservePriceChecked] = useState();
    const [reservePriceDisplay, setReservePriceDisplay] = useState();
    const [reservePrice, setReservePrice] = useState();
    const [buyoutPriceChecked, setBuyoutPriceChecked] = useState();
    const [buyoutPriceDisplay, setBuyoutPriceDisplay] = useState();
    const [buyoutPrice, setBuyoutPrice] = useState();
    const placeholderText = selectValue === 'percentage' ? '%' : '$';
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [auctionDetail, setAuctionDetail] = useState(null);
    const [productData, setProductData] = useState(null);
    const [loadingPage, setLoadingPage] = useState(true);

    const [nameInvalid, setNameInvalid] = useState('');
    const [startPriceInvalid, setStartPriceInvalid] = useState('');
    const [bidIncrementInvalid, setBidIncrementInvalid] = useState('');
    const [startDateInvalid, setStartDateInvalid] = useState('');
    const [endDateInvalid, setEndDateInvalid] = useState('');
    const [reservePriceInvalid, setReservePriceInvalid] = useState('');
    const [buyoutPriceInvalid, setBuyoutPriceInvalid] = useState('');
    const [editStatus, setEditStatus] = useState(false);

    const handleStartDateChange = (value) => {
        setStartDate(value);
    };
    const handleEndDateChange = (value) => {
        setEndDate(value);
    };
    const handleNameChange = useCallback(
        (value) => setName(value),
        [],
    );
    const handleStartPriceChange = useCallback(
        (value) => setStartPrice(value),
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
    const handleReservePrice = useCallback(
        (checked) => setReservePriceChecked(checked),
        [],
    );
    const handleReservePriceDisplay = useCallback(
        (checked) => setReservePriceDisplay(checked),
        [],
    );
    const handleReservePriceChange = useCallback(
        (value) => setReservePrice(value),
        [],
    );
    const handleBuyoutPrice = useCallback(
        (checked) => setBuyoutPriceChecked(checked),
        [],
    );
    const handleBuyoutPriceDisplay = useCallback(
        (checked) => setBuyoutPriceDisplay(checked),
        [],
    );
    const handleBuyoutPriceChange = useCallback(
        (value) => setBuyoutPrice(value),
        [],
    );

    const [updateAuction] = useMutation(UPDATE_AUCTION);

    const handleCreateAuction = async () => {
        if (
            !name || !startPrice || !bidIncrement || !startDate || !endDate || (reservePriceChecked && !reservePrice) ||
            (buyoutPriceChecked && !buyoutPrice)
        ) {
            setNameInvalid(!name ? 'This field is required' : '');
            setStartPriceInvalid(!startPrice ? 'This field is required' : '');
            setBidIncrementInvalid(!bidIncrement ? 'This field is required' : '');
            setStartDateInvalid(!startDate ? 'Please choose the valid date' : '');
            setEndDateInvalid(!endDate ? 'Please choose the valid date' : '');
            setReservePriceInvalid(reservePriceChecked && !reservePrice ? 'Please enter the reserve price' : '');
            setBuyoutPriceInvalid(buyoutPriceChecked && !buyoutPrice ? 'Please enter the buyout price' : '');
            setEditStatus(false);
        } else {
            try {
                const updatePromise = await updateAuction({
                    variables: {
                        input: {
                            id: `${shop.id}`,
                            key: auctionDetail.key,
                            name: name,
                            product_id: auctionDetail.product_id,
                            auction_thumbnail: auctionDetail.auction_thumbnail? auctionDetail.auction_thumbnail : '',
                            winner_id: auctionDetail.winner_id ? auctionDetail.winner_id : null,
                            contact_number: auctionDetail.contact_number ? auctionDetail.contact_number : null,
                            status: auctionDetail.status,
                            start_date: startDate,
                            end_date: endDate,
                            start_price: parseFloat(startPrice),
                            bid_increment: parseFloat(bidIncrement),
                            end_price: parseFloat(auctionDetail.end_price),
                            is_reverse_price: reservePriceChecked,
                            is_reverse_price_display: reservePriceDisplay,
                            reserve_price: parseFloat(reservePrice),
                            is_buyout_price: buyoutPriceChecked,
                            is_buyout_price_display: buyoutPriceDisplay,
                            buyout_price: parseFloat(buyoutPrice),
                        }
                    }
                });

                const timeoutPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error('Update program timed out'));
                    }, 10000);
                });
                await Promise.race([updatePromise, timeoutPromise]);
                shopify.toast.show('Updated successfully');
                setEditStatus(true);
            } catch (error) {
                console.error('Error:', error.message);
                shopify.toast.show('Connection timeout', {
                    isError: true,
                });
            }
        }
    };

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
            setName(auctionDetail.name);
            setStartPrice(auctionDetail.start_price);
            setBidIncrement(auctionDetail.bid_increment);
            setReservePriceChecked(auctionDetail.is_reverse_price);
            setReservePriceDisplay(auctionDetail.is_reverse_price_display);
            setReservePrice(auctionDetail.reserve_price);
            setBuyoutPriceChecked(auctionDetail.is_buyout_price);
            setBuyoutPriceDisplay(auctionDetail.is_buyout_price_display);
            setBuyoutPrice(auctionDetail.buyout_price);
            setStartDate(auctionDetail.start_date);
            setEndDate(auctionDetail.end_date);
            fetcher.load(`../../api/product?product=${auctionDetail.product_id}`);
        }
    }, [auctionDetail]);

    useEffect(() => {
        if (fetcher.data) {
            setProductData(fetcher.data);fetcher
        }
    }, [fetcher.data]);

    return (
        <>
            {auctionDetail ? (
                <Page
                    title="Edit auctions"
                    backAction={
                        {
                            content: 'Auctions',
                            onAction: () => {
                                navigate('../auctions');
                            },
                        }
                    }
                    primaryAction={{
                        content: 'Save',
                        disabled: false,
                        onAction: () => {
                            handleCreateAuction().then(() => {
                                if(editStatus){
                                    navigate('../auction/' + key);
                                }
                            });
                        },
                    }}
                >
                    <Layout>
                        <Layout.Section variant="oneThird" gap="200">
                            <div>
                                <Card>
                                    <BlockStack gap="200">
                                        <Text as="h6" variant="headingMd">General</Text>
                                        <TextField
                                            label="Name"
                                            value={name}
                                            onChange={handleNameChange}
                                            autoComplete="off"
                                            error={nameInvalid}
                                        />
                                        <TextField
                                            label="Start price"
                                            value={startPrice}
                                            onChange={handleStartPriceChange}
                                            autoComplete="off"
                                            prefix='$'
                                            error={startPriceInvalid}
                                        />
                                        <TextField
                                            label="Bid increment"
                                            type="number"
                                            value={bidIncrement}
                                            onChange={handleBidIncrementChange}
                                            autoComplete="off"
                                            prefix={placeholderText}
                                            error={bidIncrementInvalid}
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
                                            <Text as="h6" variant="headingMd">Active dates</Text>
                                        </InlineStack>
                                        <BlockStack gap="300">
                                            <TextField
                                                label="Start at"
                                                type="datetime-local"
                                                value={startDate}
                                                onChange={handleStartDateChange}
                                                autoComplete="off"
                                                error={startDateInvalid}
                                            />
                                            <TextField
                                                label="End at"
                                                type="datetime-local"
                                                value={endDate}
                                                onChange={handleEndDateChange}
                                                autoComplete="off"
                                                error={endDateInvalid}
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
                                        <Text as="h6" variant="headingMd">Selected products</Text>
                                    </InlineStack>
                                </BlockStack>
                                {productData && (
                                    <ResourceList
                                        items={[productData.product]}
                                        renderItem={(item) => {

                                            return (
                                                <ResourceItem
                                                    id={item.id}
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
                                                    <div style={{display: 'flex'}}>
                                                        <BlockStack>
                                                            <Text variant="headingMd" fontWeight="bold" as="h6">
                                                                {item.title}
                                                            </Text>
                                                            <span
                                                                style={{fontSize: '14px'}}>Price: ${item.variants[0].price}</span>
                                                        </BlockStack>
                                                        <div>
                                                            <a style={{fontSize: '14px', textDecoration: 'none'}}
                                                               href={'https://' + shop.domain + '/products/' + item.handle}
                                                               target="_blank">
                                                                <Icon
                                                                    source={ExternalIcon}
                                                                    tone="base"
                                                                />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </ResourceItem>
                                            );
                                        }
                                        }
                                    />
                                )}
                            </Card>
                            <div style={{marginTop: "10px"}}>
                                <Card roundedAbove="sm">
                                    <BlockStack inlineAlign="start" gap="200">
                                        <InlineStack gap="400">
                                            <Icon source={SettingsIcon} tone="base"/>
                                            <Text as="h6" variant="headingMd">Advanced settings</Text>
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
                                                        prefix='$'
                                                        error={reservePriceInvalid}
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
                                                        prefix='$'
                                                        error={buyoutPriceInvalid}
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
            )}
        </>
    );
}
