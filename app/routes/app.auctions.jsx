import React, {useState, useCallback} from 'react';
import {
    Page,
    Card,
    Tabs,
    useBreakpoints,
    IndexTable,
    InlineStack,
    Icon,
    Button,
    Pagination,
    BlockStack,
    Text,
    Badge
} from '@shopify/polaris';
import {useNavigate} from '@remix-run/react';
import {
    ThemeEditIcon,
    ViewIcon
} from '@shopify/polaris-icons';

export default function Programs() {
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const auctions = [
        [
            {
                id: '1018',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 3',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-05-10T16:21",
            },
            {
                id: '1017',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 4',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-05-10T16:21",
            },
            {
                id: '1014',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 7',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-05-10T16:21",
            }
        ],
        [
            {
                id: '1020',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 1',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-05-04T18:21",
                end_date: "2024-05-10T16:21",
            },
            {
                id: '1019',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 2',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-05-04T18:21",
                end_date: "2024-05-10T16:21",
            },
            {
                id: '1013',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 8',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-05-04T18:21",
                end_date: "2024-05-10T16:21",
            }
        ],
        [
            {
                id: '1016',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 5',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-04-10T16:21",
            },
            {
                id: '1015',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 6',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-04-10T16:21",
            },
            {
                id: '1011',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 10',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-04-10T16:21",
            },
            {
                id: '1010',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 11',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-04-10T16:21",
            },
            {
                id: '1009',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 12',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-04-10T16:21",
            },
            {
                id: '1012',
                productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
                name: 'test auction 9',
                start_price: 100,
                bid_increment: 10,
                end_price: 150,
                product_id: '11052470370622',
                has_reserve_price: true,
                reserve_price_display: false,
                reserve_price: 300,
                has_buyout_price: false,
                buyout_price_display: false,
                buyout_price: null,
                start_date: "2024-04-04T18:21",
                end_date: "2024-04-10T16:21",
            }
        ],
    ];
    const auctionsList = [
        {
            id: '1020',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 1',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-05-04T18:21",
            end_date: "2024-05-10T16:21",
        },
        {
            id: '1019',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 2',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-05-04T18:21",
            end_date: "2024-05-10T16:21",
        },
        {
            id: '1018',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 3',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-05-10T16:21",
        },
        {
            id: '1017',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 4',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-05-10T16:21",
        },
        {
            id: '1016',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 5',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-04-10T16:21",
        },
        {
            id: '1015',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 6',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-04-10T16:21",
        },
        {
            id: '1011',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 10',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-04-10T16:21",
        },
        {
            id: '1010',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 11',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-04-10T16:21",
        },
        {
            id: '1009',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 12',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-04-10T16:21",
        },
        {
            id: '1014',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 7',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-05-10T16:21",
        },
        {
            id: '1013',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 8',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-05-04T18:21",
            end_date: "2024-05-10T16:21",
        },
        {
            id: '1012',
            productUrl: 'https://trungvt-store.myshopify.com/products/a-star-is-born-sheer-midaxi-skirt',
            name: 'test auction 9',
            start_price: 100,
            bid_increment: 10,
            end_price: 150,
            product_id: '11052470370622',
            has_reserve_price: true,
            reserve_price_display: false,
            reserve_price: 300,
            has_buyout_price: false,
            buyout_price_display: false,
            buyout_price: null,
            start_date: "2024-04-04T18:21",
            end_date: "2024-04-10T16:21",
        }
    ];
    const paginatedItems = auctions[selected].slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handleTabChange = useCallback((selectedTabIndex) => {
        setSelected(selectedTabIndex);
        setCurrentPage(1);
    }, []);

    const tabs = [
        {
            id: 'active-auction',
            content: <span style={{fontSize: '16px'}}>Active auctions</span>,
            panelID: 'active-auction-content-1',
        },
        {
            id: 'scheduled-auction',
            content: <span style={{fontSize: '16px'}}>Scheduled auctions</span>,
            panelID: 'scheduled-auction-content-1',
        },
        {
            id: 'completed-auction',
            content: <span style={{fontSize: '16px'}}>Completed auctions</span>,
            panelID: 'completed-auction-content-1',
        },
    ];
    const resourceName = {
        singular: 'auctions',
        plural: 'auctions',
    };
    const rowMarkup = paginatedItems.map(
        (
            { id, name, start_price, bid_increment, end_price, start_date, end_date },
            index
        ) => {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            return (
                <IndexTable.Row id={id} key={id} position={index}>
                    <IndexTable.Cell>
                        <Text as="h5" variant="bodyMd">#{id}</Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell><span>{name}</span></IndexTable.Cell>
                    <IndexTable.Cell><span>${end_price}</span></IndexTable.Cell>
                    <IndexTable.Cell><span>${bid_increment}</span></IndexTable.Cell>
                    <IndexTable.Cell>
                        {startDate > Date.now() &&(
                            <Badge tone="info">Scheduled</Badge>
                        )}
                        {startDate < Date.now() && endDate > Date.now() &&(
                            <Badge tone="success">Running</Badge>
                        )}
                        {endDate < Date.now() &&(
                            <Badge tone="attention">Finished</Badge>
                        )}
                    </IndexTable.Cell>
                    <IndexTable.Cell><span>{startDate.toLocaleString()}</span></IndexTable.Cell>
                    <IndexTable.Cell><span>{endDate.toLocaleString()}</span></IndexTable.Cell>
                    <IndexTable.Cell>
                        <InlineStack align='center' gap="400" wrap={false}>
                            <Button onClick={() => navigate('../auction/edit/' + id)}>
                                <Icon
                                    source={ThemeEditIcon}
                                    tone="base"
                                />
                            </Button>
                            <Button onClick={() => navigate('../auction/' + id)}>
                                <Icon
                                    source={ViewIcon}
                                    tone="base"
                                />
                            </Button>

                        </InlineStack>
                    </IndexTable.Cell>
                </IndexTable.Row>
            );
        }
    );

    return (
        <Page
            title="Auctions"
            primaryAction={{
                content: 'Create Auction',
                disabled: false,
                onAction: () => {
                    navigate('../auction');
                },
            }}
        >
            <Card>
                <div style={{minHeight: "510px"}}>
                    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
                        <p style={{padding: "10px", fontSize: "14px"}}>{auctions[selected].length} auctions found</p>
                        <IndexTable
                            condensed={useBreakpoints().smDown}
                            resourceName={resourceName}
                            itemCount={auctions[selected].length}
                            headings={[
                                {title: 'ID'},
                                {title: 'Name'},
                                {title: 'Bids'},
                                {title: 'Bid increment'},
                                {title: 'Status', alignment: 'center'},
                                {title: 'Start at'},
                                {title: 'End at'},
                                {title: 'Actions', alignment: 'center'},
                            ]}
                            selectable={false}
                        >
                            {rowMarkup}
                        </IndexTable>
                        {auctions[selected].length > itemsPerPage && (
                            <div style={{width: "100%", position: "absolute", bottom: "12px"}}>
                                <BlockStack inlineAlign="center">
                                    <Pagination
                                        hasPrevious={currentPage > 1}
                                        onPrevious={() => handlePageChange(currentPage - 1)}
                                        hasNext={currentPage * itemsPerPage < auctions[selected].length}
                                        onNext={() => handlePageChange(currentPage + 1)}
                                    />
                                </BlockStack>
                            </div>
                        )}
                    </Tabs>
                </div>

            </Card>
        </Page>
    );
}
