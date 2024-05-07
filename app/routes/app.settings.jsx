import {
    Page,
    Form,
    FormLayout,
    Checkbox,
    TextField,
    Button,
    Select,
    Text,
    BlockStack,
    Card,
    Tabs,
    ChoiceList
} from '@shopify/polaris';
import React, { useState, useCallback } from 'react';
import axios from "axios";
import {json} from "@remix-run/node";
import {
    useLoaderData,
} from "@remix-run/react";
import {authenticate} from "../shopify.server";

export const loader = async ({request}) => {
    const {session} = await authenticate.admin(request);

    let store = await axios.get(`https://${session.shop}/admin/api/2024-04/shop.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken, "Accept-Encoding": "application/json",
        },
    });
    store = store.data.shop;
    console.log(store);

    return json({session: session, shop: store});
}
function FormOnSubmitExample() {
    const {shop} = useLoaderData();
    const [email, setEmail] = useState(shop.email);
    const [isTimeout, setIsTimeout] = useState(false);
    const [timeoutOption, setTimeoutOption] = useState(1);
    const [selectedTab, setSelectedTab] = useState(0);
    const [checked, setChecked] = useState(false);
    const handleChange = useCallback(
        (newChecked) => setChecked(newChecked),
        [],
    );

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        [],
    );
    const handleSubmit = useCallback(() => {
        setEmail('');
    }, []);

    const handleEmailChange = useCallback(
        (value) => setEmail(value),
        [],
    );
    const handleIsTimeout = useCallback(
        (checked) => setIsTimeout(checked),
        [],
    );
    const handleTimeoutOption = useCallback(
        (value) => setTimeoutOption(value),
        [],
    );

    const timeoutOptions = [
        {
            label: "1 day",
            value: "1"
        },
        {
            label: "3 days",
            value: "3"
        },
        {
            label: "5 days",
            value: "5"
        },
        {
            label: "1 week",
            value: "7"
        }
    ];

    const tabs = [
        {
            id: 'general',
            content: <span style={{ fontSize: '14px' }}>General</span>,
            panelID: 'general-settings',
        },
        {
            id: 'display',
            content: <span style={{ fontSize: '14px' }}>Display</span>,
            panelID: 'display-settings',
        },
    ];

    return (
        <Page
            title="Setting"
            primaryAction={{
                content: 'Save',
                disabled: false,
                onAction: () => {
                    // navigate('../auctions');
                },
            }}
        >
            <Card>
                <Form onSubmit={handleSubmit}>
                    <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} fitted>
                        <FormLayout>
                            {selectedTab === 0 && (
                                <BlockStack>
                                    <TextField
                                        label="Timezone"
                                        value={shop.timezone}
                                        helpText={
                                            <span>
                                                We will use your store's timezone as the default.
                                            </span>
                                        }
                                    />
                                    <TextField
                                        label="Admin emails"
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        helpText={
                                            <span>
                                                This email is utilized for sending notification emails to customers.
                                            </span>
                                        }
                                    />
                                    <div style={{marginTop: "10px"}}>
                                        <BlockStack>
                                            <Checkbox
                                                label="Set pricing timeout"
                                                helpText="No winning bidder if closing price is below reserve price."
                                                checked={isTimeout}
                                                onChange={handleIsTimeout}
                                            />
                                            {isTimeout && (
                                                <div style={{width: "45%"}}>
                                                    <Select
                                                        label="Choose pricing period"
                                                        options={timeoutOptions}
                                                        value={timeoutOption}
                                                        onChange={handleTimeoutOption}
                                                    />
                                                </div>
                                            )}
                                        </BlockStack>
                                    </div>
                                </BlockStack>
                            )}
                            {selectedTab === 1 && (
                                <Checkbox
                                    label="Basic checkbox"
                                    checked={checked}
                                    onChange={handleChange}
                                    tone="magic"
                                    bleed
                                />
                            )}
                            <Button variant="primary" submit>Submit</Button>
                        </FormLayout>
                    </Tabs>
                </Form>
            </Card>
        </Page>
    );
}


export default FormOnSubmitExample;
