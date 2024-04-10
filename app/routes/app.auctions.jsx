import { useState, useCallback } from 'react';
import {Page, Card, Tabs, LegacyCard, Badge, useBreakpoints, Text, IndexTable, InlineStack, Icon, Button} from '@shopify/polaris';
import { useNavigate } from '@remix-run/react';
import {
    ThemeEditIcon,
    ViewIcon
} from '@shopify/polaris-icons';

export default function Programs() {
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );
    const orders = [
        [
            {
                id: '1020',
                product:'A Star Is Born Sheer Midaxi Skirt - Limited',
                url:'https://cdn.shopify.com/s/files/1/0744/0089/1198/products/star-skirt.jpg?v=1710257304',
                date: 'Jul 20 at 4:34pm',
                total: '$969.44',
                editUrl: '#',
                productUrl:'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            },
            {
                id: '1019',
                product:'A Star Is Born Sheer Midaxi Skirt - Limited',
                url:'https://cdn.shopify.com/s/files/1/0744/0089/1198/products/star-skirt.jpg?v=1710257304',
                date: 'Jul 20 at 3:46pm',
                total: '$701.19',
                editUrl: '#',
                productUrl:'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            },
            {
                id: '1020',
                product:'A Star Is Born Sheer Midaxi Skirt - Limited',
                url:'https://cdn.shopify.com/s/files/1/0744/0089/1198/products/star-skirt.jpg?v=1710257304',
                date: 'Jul 20 at 4:34pm',
                total: '$969.44',
                editUrl: '#',
                productUrl:'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            },
            {
                id: '1019',
                product:'A Star Is Born Sheer Midaxi Skirt - Limited',
                url:'https://cdn.shopify.com/s/files/1/0744/0089/1198/products/star-skirt.jpg?v=1710257304',
                date: 'Jul 20 at 3:46pm',
                total: '$701.19',
                editUrl: '#',
                productUrl:'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            }
        ],
        [{
            id: '1018',
            product:'A Star Is Born Sheer Midaxi Skirt - Limited',
            url:'https://cdn.shopify.com/s/files/1/0744/0089/1198/products/star-skirt.jpg?v=1710257304',
            date: 'Jul 20 at 3.44pm',
            total: '$798.24',
            editUrl: '#',
            productUrl:'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
        }],
        [{
            id: '1019',
            product:'A Star Is Born Sheer Midaxi Skirt - Limited',
            url:'https://cdn.shopify.com/s/files/1/0744/0089/1198/products/star-skirt.jpg?v=1710257304',
            date: 'Jul 20 at 3:46pm',
            total: '$701.19',
            editUrl: '#',
            productUrl:'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
        }],
        [{
            id: '1019',
            product:'A Star Is Born Sheer Midaxi Skirt - Limited',
            url:'https://cdn.shopify.com/s/files/1/0744/0089/1198/products/star-skirt.jpg?v=1710257304',
            date: 'Jul 20 at 3:46pm',
            total: '$701.19',
            editUrl: '#',
            productUrl:'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
        }],
    ];
    const tabs = [
        {
            id: 'all',
            content: <span style={{ fontSize: '16px' }}>All</span>,
            panelID: 'all-content-1',
        },
        {
            id: 'active-auction',
            content: <span style={{ fontSize: '16px' }}>Active auctions</span>,
            panelID: 'active-auction-content-1',
        },
        {
            id: 'scheduled-auction',
            content: <span style={{ fontSize: '16px' }}>Scheduled auctions</span>,
            panelID: 'scheduled-auction-content-1',
        },
        {
            id: 'completed-auction',
            content: <span style={{ fontSize: '16px' }}>Completed auctions</span>,
            panelID: 'completed-auction-content-1',
        },
    ];
    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };
    const rowMarkup = orders[selected].map(
        (
            {id,product,url, date, total},
            index,
        ) => (
            <IndexTable.Row id={id} key={id} position={index}>
                <IndexTable.Cell>
                    <InlineStack wrap={false}>
                        <img
                            src={url}
                            alt={"a sheet with purple and orange stripes"}
                            style={{width: "40px", height:"60px"}}
                        />
                        <span style={{textAlign: "center", padding: "20px", fontSize: "14px"}}>{product}</span>
                    </InlineStack>
                </IndexTable.Cell>
                <IndexTable.Cell><span style={{ fontSize: "14px"}}>{date}</span></IndexTable.Cell>
                <IndexTable.Cell><span style={{ fontSize: "14px"}}>{total}</span></IndexTable.Cell>
                <IndexTable.Cell>
                    <InlineStack align='center' gap="400" wrap={false}>
                        <Button>
                            <Icon
                                source={ThemeEditIcon}
                                tone="base"
                            />
                        </Button>
                        <Button>
                            <Icon
                                source={ViewIcon}
                                tone="base"
                            />
                        </Button>

                    </InlineStack>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <Page
            title="Auctions"
            primaryAction={{
                content: 'Create Auction',
                disabled: false,
                onAction: () => {
                    navigate('../point_program');
                },
            }}
        >
            <Card>
                <div style={{minHeight:"400px"}}>
                    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
                        <LegacyCard.Section>
                            <p style={{padding:"10px" , fontSize:"14px"}}>{orders[selected].length} auctions found</p>
                            <IndexTable
                                condensed={useBreakpoints().smDown}
                                resourceName={resourceName}
                                itemCount={orders.length}
                                headings={[
                                    {title: 'Product'},
                                    {title: 'Date'},
                                    {title: 'Bids'},
                                    {title: 'Actions', alignment: 'center'},
                                ]}
                                selectable={false}
                            >
                                {rowMarkup}
                            </IndexTable>
                        </LegacyCard.Section>
                    </Tabs>
                </div>

            </Card>
        </Page>
    );
}
