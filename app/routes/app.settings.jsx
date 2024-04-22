import {
    Page,
    Form,
    FormLayout,
    Checkbox,
    TextField,
    Button,
    Select
} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import axios from "axios";
import {json} from "@remix-run/node";
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
    const [newsletter, setNewsletter] = useState(false);
    const [email, setEmail] = useState('');
    const [timezone, setTimezone] = useState('today');
    const handleSubmit = useCallback(() => {
        setEmail('');
        setNewsletter(false);
    }, []);

    const handleSelectChange = useCallback(
        (value) => setTimezone(value),
        [],
    );
    const handleNewsLetterChange = useCallback(
        (value) => setNewsletter(value),
        [],
    );

    const handleEmailChange = useCallback((value) => setEmail(value), []);

    const options = [
        {label: 'Today', value: 'today'},
        {label: 'Yesterday', value: 'yesterday'},
        {label: 'Last 7 days', value: 'lastWeek'},
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
            <Form onSubmit={handleSubmit}>
                <div style={{fontSize: "14px"}}>
                    <FormLayout>
                        <Select
                            label="Timezone"
                            options={options}
                            onChange={handleSelectChange}
                            value={timezone}
                        />
                        <TextField
                            value={email}
                            onChange={handleEmailChange}
                            label="Email"
                            type="email"
                            autoComplete="email"
                            helpText={
                                <span>
                                We’ll use this email address to inform you on future changes to
                                Polaris.
                            </span>
                            }
                        />

                        <Button submit>Submit</Button>
                    </FormLayout>
                </div>
            </Form>
        </Page>
    );
}


export default FormOnSubmitExample;
