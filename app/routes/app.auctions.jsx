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
    Badge
} from '@shopify/polaris';
import {useNavigate, useLoaderData} from '@remix-run/react';
import {
    ThemeEditIcon,
    ViewIcon
} from '@shopify/polaris-icons';
import {useQuery} from "@apollo/client";
import {GET_AUCTIONS} from "../graphql/query";
import {authenticate} from "../shopify.server";
import axios from "axios";
import {json} from "@remix-run/node";

export const loader = async ({request}) => {
    const {session} = await authenticate.admin(request);
    let store = await axios.get(`https://${session.shop}/admin/api/2024-04/shop.json`, {
        headers: {
            "X-Shopify-Access-Token": session.accessToken, "Accept-Encoding": "application/json",
        },
    });
    store = store.data.shop;

    return json({session: session, shop: store});
}

export default function AuctionsList() {
    const {session, shop} = useLoaderData();
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const {loading: auctionsQueryLoading, data: auctionsQuery, error: dataError} = useQuery(GET_AUCTIONS, {
        variables: {
            input: {
                id: `${shop.id}`
            }
        }
    })

    let auctionsList = [];

    if (dataError) {
        console.log(dataError);
    } else if (!auctionsQueryLoading) {
        auctionsQuery.getAuctions.map(
            (
                {
                    id, key, name, product_id, status, start_date, end_date, start_price, bid_increment, end_price,
                    is_reverse_price, is_reverse_price_display, reserve_price, is_buyout_price, is_buyout_price_display,
                    buyout_price, createdAt, updatedAt,
                },
                index
            ) => {
                auctionsList.push(
                    {
                        id,
                        key,
                        name,
                        product_id,
                        start_date,
                        end_date,
                        start_price,
                        bid_increment,
                        end_price,
                        is_reverse_price,
                        is_reverse_price_display,
                        reserve_price,
                        is_buyout_price,
                        is_buyout_price_display,
                        buyout_price,
                    }
                );
            }
        );

    }

    auctionsList = auctionsList.slice().reverse();
    const auctions = [
        [], [], [],
    ];

    auctionsList.map(
        (
            {
                id,
                key,
                name,
                product_id,
                start_date,
                end_date,
                start_price,
                bid_increment,
                end_price,
                is_reverse_price,
                is_reverse_price_display,
                reserve_price,
                is_buyout_price,
                is_buyout_price_display,
                buyout_price,
            },
            index
        ) => {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            if (startDate > Date.now()) {
                auctions[1].push(
                    {
                        id,
                        key,
                        name,
                        product_id,
                        start_date,
                        end_date,
                        start_price,
                        bid_increment,
                        end_price,
                        is_reverse_price,
                        is_reverse_price_display,
                        reserve_price,
                        is_buyout_price,
                        is_buyout_price_display,
                        buyout_price,
                    }
                );
            } else if (startDate < Date.now() && endDate > Date.now()) {
                auctions[0].push(
                    {
                        id,
                        key,
                        name,
                        product_id,
                        start_date,
                        end_date,
                        start_price,
                        bid_increment,
                        end_price,
                        is_reverse_price,
                        is_reverse_price_display,
                        reserve_price,
                        is_buyout_price,
                        is_buyout_price_display,
                        buyout_price,
                    }
                );
            } else {
                auctions[2].push(
                    {
                        id,
                        key,
                        name,
                        product_id,
                        start_date,
                        end_date,
                        start_price,
                        bid_increment,
                        end_price,
                        is_reverse_price,
                        is_reverse_price_display,
                        reserve_price,
                        is_buyout_price,
                        is_buyout_price_display,
                        buyout_price,
                    }
                );
            }
        }
    );
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
            {id, key, name, start_price, bid_increment, end_price, start_date, end_date},
            index
        ) => {
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            return (
                <IndexTable.Row id={key} key={key} position={index}>
                    <IndexTable.Cell><span>{name}</span></IndexTable.Cell>
                    <IndexTable.Cell>
                        <span>${start_price}</span>
                    </IndexTable.Cell>
                    <IndexTable.Cell><span>{end_price ? '$' + end_price : '$0'}</span></IndexTable.Cell>
                    <IndexTable.Cell><span>${bid_increment}</span></IndexTable.Cell>
                    <IndexTable.Cell>
                        {startDate > Date.now() && (
                            <Badge tone="info">Scheduled</Badge>
                        )}
                        {startDate < Date.now() && endDate > Date.now() && (
                            <Badge tone="success">Running</Badge>
                        )}
                        {endDate < Date.now() && (
                            <Badge tone="attention">Finished</Badge>
                        )}
                    </IndexTable.Cell>
                    <IndexTable.Cell><span>{startDate.toLocaleString()}</span></IndexTable.Cell>
                    <IndexTable.Cell><span>{endDate.toLocaleString()}</span></IndexTable.Cell>
                    <IndexTable.Cell>
                        <InlineStack align='center' gap="400" wrap={false}>
                            {!(endDate < Date.now()) && (
                                <Button onClick={() => navigate('../auction/edit/' + key)}>
                                    <Icon
                                        source={ThemeEditIcon}
                                        tone="base"
                                    />
                                </Button>
                            )}
                            <Button onClick={() => navigate('../auction/' + key)}>
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
                    navigate('../auction/create');
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
                                {title: 'Name'},
                                {title: 'Start Price'},
                                {title: 'Current Bids'},
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
