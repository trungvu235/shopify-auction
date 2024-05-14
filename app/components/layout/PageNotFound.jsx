import {Text} from "@shopify/polaris";
import React from "react";

export default function PageNotFound() {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                color: 'rgb(26,32,44)',
                alignItems: 'center'
            }}
        >
            <Text as="h2" variant="headingLg" tone='inherit'>404 | NOT FOUND</Text>
        </div>
    );
}
