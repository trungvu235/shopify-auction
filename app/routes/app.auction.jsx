import { useState, useCallback } from 'react';
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
    List,
    TextField,
    Select,
    ResourceList,
    Thumbnail,
    ResourceItem
} from '@shopify/polaris';
import { useNavigate } from '@remix-run/react';
import {
    ProductIcon,
    CalendarTimeIcon,
    XIcon
} from '@shopify/polaris-icons';
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";

export const loader = async ({request}) => {
    const {session} = await authenticate.admin(request);
    let products = await axios.get(`https://${session.shop}/admin/api/2024-04/products.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken,
            "Accept-Encoding": "application/json",
        },
        params :{
            limit: 100
        }
    });

    return null;
}

export default function AuctionForm() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    const [startPrice, setStartPrice] = useState(null);
    const [bidIncrement, setBidIncrement] = useState(null);
    const [selectValue, setSelectValue] = useState('kg');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const addProductImage = "/add-product.png";

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

    const placeholderText = selectValue === 'fixed' ? '$ 0' : '% 0';

    const handleResourcePicker = async () => {
        const products = await window.shopify.resourcePicker({
            type: "product",
            action: "select",
            multiple: 3,
        });
        if(products){
            const selectedProducts = products.map(product => {
                const {images, id, variants, title, handle} = product;
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

    const removeItemFromFormState = useCallback(() => {

    }, []);

    return (
        <Page
            title="Create an Auction"
            primaryAction={{
                content: 'Create',
                disabled: false,
                onAction: () => {
                    navigate('../point_program');
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
                            <BlockStack gap="200">
                                <Text as="h2" variant="headingSm">
                                    Active dates
                                </Text>
                                <TextField
                                    label="Start at"
                                    value={name}
                                    onChange={handleNameChange}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="End at must after Start at"
                                    value={startPrice}
                                    onChange={handleStartPriceChange}
                                    autoComplete="off"
                                />
                                <TextField
                                    label="label"
                                    value=""
                                    autoComplete="off"
                                    onChange={() => {}}
                                    prefix={<Icon source={CalendarTimeIcon} />}
                                    onFocus={() => {
                                        // show Datepicker component
                                    }}
                                />
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
                        <BlockStack inlineAlign="center" gap="200">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img
                                    src={addProductImage}
                                    alt="add product"
                                    style={{maxWidth: "300px"}}
                                />
                                <p style={{ marginBottom: "10px" }}>Select one or more existing products in your store.</p>
                                <Button variant="primary" onClick={handleResourcePicker}>Select products</Button>
                            </div>
                        </BlockStack>
                        <BlockStack inlineAlign="start" gap="200">
                            <List type="none">
                                {selectedProducts.map((product) => (
                                    <List.Item key={product.productId}>
                                        <InlineStack gap="300">
                                            <Thumbnail
                                                source = {product.productImage || ""}
                                                alt={product.productAlt}
                                            />
                                            <BlockStack>
                                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                    {product.productTitle} - {product.variantTitle}
                                                </Text>
                                                <span>Price: ${product.variantPrice}</span>
                                            </BlockStack>
                                            <Icon
                                                source={XIcon}
                                                tone="base"
                                            />
                                        </InlineStack>
                                    </List.Item>
                                ))}
                            </List>
                            <ResourceList
                                resourceName={{singular: 'customer', plural: 'customers'}}
                                items={selectedProducts}
                                renderItem={(item) => {
                                    const shortcutActions = [
                                        {
                                            content: "Remove",
                                            onAction: () => removeItemFromFormState(),
                                        }
                                    ];

                                    return (
                                        <ResourceItem
                                            id={item.productId}
                                            media={<Thumbnail
                                                source = {item.productImage || ""}
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
                            <Button variant="primary" onClick={handleResourcePicker}>Add Another Products</Button>
                        </BlockStack>

                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
