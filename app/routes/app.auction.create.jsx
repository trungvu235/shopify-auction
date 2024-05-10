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
import {useNavigate, useLoaderData} from '@remix-run/react';
import { ProductIcon, CalendarIcon, SettingsIcon } from '@shopify/polaris-icons';
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";
import { useMutation } from "@apollo/client";
import { CREATE_AUCTION } from "../graphql/mutation";
import { ulid } from 'ulid';

export const loader = async ({request}) => {
    const {session} = await authenticate.admin(request);
    let products = await axios.get(`https://${session.shop}/admin/api/2024-04/products.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Accept-Encoding": "application/json",
        },
        params: {
            limit: 100
        }
    });
    let store = await axios.get(`https://${session.shop}/admin/api/2024-04/shop.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken, "Accept-Encoding": "application/json",
        },
    });
    store = store.data.shop;

    return json({session: session, shop: store});
}

export default function AuctionForm() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    const [startPrice, setStartPrice] = useState(null);
    const [bidIncrement, setBidIncrement] = useState(null);
    const [selectValue, setSelectValue] = useState('fixed');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const addProductImage = "/add-product.png";
    const [reservePriceChecked, setReservePriceChecked] = useState(false);
    const [reservePriceDisplay, setReservePriceDisplay] = useState(false);
    const [reservePrice, setReservePrice] = useState(null);
    const [buyoutPriceChecked, setBuyoutPriceChecked] = useState(false);
    const [buyoutPriceDisplay, setBuyoutPriceDisplay] = useState(false);
    const [buyoutPrice, setBuyoutPrice] = useState(null);
    const placeholderText = selectValue === 'percentage' ? '% 0' : '$ 0';
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const {session, shop} = useLoaderData();

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
        (value) => setStartPrice(parseInt(value, 10)),
        [],
    );
    const handleBidIncrementChange = useCallback(
        (value) => setBidIncrement(parseInt(value, 10)),
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
        (value) => setReservePrice(parseInt(value, 10)),
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
        (value) => setBuyoutPrice(parseInt(value, 10)),
        [],
    );

    const handleResourcePicker = async () => {
        const products = await window.shopify.resourcePicker({
            type: "product",
            action: "select",
            multiple: 1,
        });
        if (products) {
            const selectedProducts = products.map(product => {
                const {images, id, variants, title, handle} = product;
                console.log(product);
                return variants.map(variant => {
                    return {
                        productId: id,
                        productVariantId: variant.id,
                        productTitle: title,
                        productHandle: handle,
                        productAlt: images[0]?.altText,
                        productImage: images[0]?.originalSrc,
                        variantTitle: variant.title,
                        variantPrice: variant.price,
                        variantSKU: variant.sku,
                    };
                });
            });
            setSelectedProducts(selectedProducts.flat());
        }
    };

    const [createAuction] = useMutation(CREATE_AUCTION);
    const handleCreateAuction = async () => {
        const auction = {
            variables: {
                input: {
                    id: ulid(),
                    store_id: shop.id,
                    general: {
                        name: name,
                        start_price: startPrice,
                        bid_increment: bidIncrement,
                    },
                    selected_product: selectedProducts ? selectedProducts[0].productId : null,
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
        const productId = selectedProducts[0].productId.replace(/^.*\/(\d+)$/, "$1");
        try {
            const createPromise = await createAuction({
                variables: {
                    input: {
                        id: `${shop.id}`,
                        key: ulid(),
                        name: name,
                        product_id: productId,
                        status: true,
                        start_date: startDate,
                        end_date: endDate,
                        start_price: startPrice,
                        bid_increment: bidIncrement,
                        end_price: null,
                        is_reverse_price: reservePriceChecked,
                        is_reverse_price_display: reservePriceDisplay,
                        reserve_price: reservePrice,
                        is_buyout_price: buyoutPriceChecked,
                        is_buyout_price_display: buyoutPriceDisplay,
                        buyout_price: buyoutPrice,
                    }
                }
            });

            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Update program timed out'));
                }, 10000);
            });

            await Promise.race([createPromise, timeoutPromise]);

            shopify.toast.show('Updated successfully');

        } catch (error) {
            console.error('Error:', error.message);
            shopify.toast.show('Connection timeout', {
                isError: true,
            });
        }
    };

    const removeItemFromFormState = useCallback((productIdToDelete) => {
        setSelectedProducts(prevProducts => {
            return prevProducts.filter(product => product.productVariantId !== productIdToDelete);
        });
    }, []);

    return (
        <Page
            title="Create an Auction"
            primaryAction={{
                content: 'Create',
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
                                    type="number"
                                    prefix='$'
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
                                <BlockStack>
                                    <InlineStack gap="400">
                                        <TextField
                                            label="Start At"
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            autoComplete="off"
                                        />
                                    </InlineStack>
                                </BlockStack>
                                <BlockStack>
                                    <InlineStack gap="400">
                                        <TextField
                                            label="End At"
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            autoComplete="off"
                                        />
                                    </InlineStack>
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
                        {selectedProducts.length === 0 && (
                            <BlockStack inlineAlign="center" gap="200">
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <img
                                        src={addProductImage}
                                        alt="add product"
                                        style={{maxWidth: "300px"}}
                                    />
                                    <p style={{marginBottom: "10px"}}>Select one or more existing products in your
                                        store.</p>
                                    <Button variant="primary" onClick={handleResourcePicker}>Select products</Button>
                                </div>
                            </BlockStack>
                        )}
                        {selectedProducts.length !== 0 && (
                            <BlockStack inlineAlign="end" gap="200">
                                <div style={{width: "100%", marginTop: "10px"}}>
                                    <ResourceList
                                        resourceName={{singular: 'customer', plural: 'customers'}}
                                        items={paginatedItems}
                                        renderItem={(item) => {
                                            const shortcutActions = [
                                                {
                                                    content: "Remove",
                                                    onAction: () => removeItemFromFormState(item.productVariantId),
                                                }
                                            ];

                                            return (
                                                <ResourceItem
                                                    id={item.productId}
                                                    media={<Thumbnail
                                                        source={item.productImage || ""}
                                                        alt={item.productAlt}
                                                    />}
                                                    shortcutActions={shortcutActions}
                                                >
                                                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                        {item.productTitle} - {item.variantTitle}
                                                    </Text>
                                                    <span>Price: ${item.variantPrice}</span>
                                                </ResourceItem>
                                            );
                                        }
                                        }
                                    />
                                    {selectedProducts.length > itemsPerPage && (
                                        <Pagination
                                            hasPrevious={currentPage > 1}
                                            onPrevious={() => handlePageChange(currentPage - 1)}
                                            hasNext={currentPage * itemsPerPage < selectedProducts.length}
                                            onNext={() => handlePageChange(currentPage + 1)}
                                        />
                                    )}
                                </div>
                                <Button variant="primary" onClick={handleResourcePicker}>Choose Another Products</Button>
                            </BlockStack>
                        )}
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
                                                prefix='$'
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
