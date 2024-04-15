import { useState, useCallback } from 'react';
import React from 'react';
import {
    Page,
    Card,
    Tabs,
    LegacyCard,
    useBreakpoints,
    Text,
    IndexTable,
    InlineStack,
    Icon,
    Button,
    LegacyStack,
    RadioButton,
    Layout,
    BlockStack,
    List,
    TextField,
    Select,
    DatePicker
} from '@shopify/polaris';
import { useNavigate } from '@remix-run/react';
import {
    ThemeEditIcon,
    ViewIcon,
    ProductIcon,
    CalendarTimeIcon
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
                                <Text as="h2" variant="headingSm">
                                    Products
                                </Text>
                            </InlineStack>
                            <List>
                                <List.Item>Socks</List.Item>
                                <List.Item>Super Shoes</List.Item>
                            </List>
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
