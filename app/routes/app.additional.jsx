import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  ResourceList,
  Avatar,
  ResourceItem,
  Icon,
} from "@shopify/polaris";
import React from 'react';
import {
  ViewIcon
} from '@shopify/polaris-icons';

export default function AdditionalPage() {
  return (
    <Page fullWidth>
      <ui-title-bar title="Auctions" />
      <Layout>
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={{singular: 'customer', plural: 'customers'}}
              items={[
                {
                  id: '110',
                  url: '#',
                  name: 'Mae Jemison',
                  location: 'Decatur, USA',
                  latestOrderUrl: '#',
                },
                {
                  id: '210',
                  url: '#',
                  name: 'Ellen Ochoa',
                  location: 'Los Angeles, USA',
                  latestOrderUrl: '#',
                },
              ]}
              renderItem={(item) => {
                const {id, url, name, location, latestOrderUrl} = item;
                const media = <Avatar customer size="md" name={name} />;
                const shortcutActions = latestOrderUrl
                  ? [
                    {
                      content: 'View latest order',
                      accessibilityLabel: `View ${name}’s latest order`,
                      url: latestOrderUrl,
                    },
                    {
                      content: 'View latest order',
                      accessibilityLabel: `View ${name}’s latest order`,
                      url: latestOrderUrl,
                    },
                  ]
                  : undefined;

                return (
                  <ResourceItem
                    id={id}
                    url={url}
                    media={media}
                    accessibilityLabel={`View details for ${name}`}
                    shortcutActions={shortcutActions}
                    persistActions
                  >
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                      {name}
                    </Text>
                    <div>{location}</div>
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="1"
      paddingInlineEnd="1"
      background="bg-subdued"
      borderWidth="1"
      borderColor="border"
      borderRadius="1"
    >
      <code>{children}</code>
    </Box>
  );
}
