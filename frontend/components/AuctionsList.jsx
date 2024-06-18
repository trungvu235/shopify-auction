import {Flex, Tag, Card, Pagination} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {testFetch_2} from "@/utils/apis";
import client from "../../app/graphql/client";
import {GET_BIDS} from "../../app/graphql/query";
import Countdown from "react-countdown";

const { Meta } = Card;

export default function AuctionsList({page, setPage, auctionKey, setAuctionKey}) {
    const [auctions, setAuctions] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [bids, setBids] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    async function fetchBids() {
        try {
            const response = await client.query({
                query: GET_BIDS,
                variables: {
                    input: {
                        id: `${window.shopifyCustomer.id}`
                    }
                },
                fetchPolicy: "no-cache"
            });
            setBids(response.data.getBids);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchBids();
    }, []);

    useEffect(() => {
        if (bids) {
            const auctionIds = bids.map(bid => bid.key);
            const key = JSON.stringify(auctionIds);
            testFetch_2(key).then(response => {
                if (response) {
                    const fetchedAuctions = response.response.data.getAuctions.slice().reverse();
                    const now = new Date();
                    fetchedAuctions.sort((a, b) => {
                        const isARunning = new Date(a.start_date) <= now && new Date(a.end_date) > now;
                        const isBRunning = new Date(b.start_date) <= now && new Date(b.end_date) > now;

                        const isAUpcoming = new Date(a.start_date) > now;
                        const isBUpcoming = new Date(b.start_date) > now;

                        const isAClosed = new Date(a.end_date) < now;
                        const isBClosed = new Date(b.end_date) < now;

                        if (isARunning && !isBRunning) return -1;
                        if (!isARunning && isBRunning) return 1;

                        if (isAUpcoming && !isBUpcoming) return -1;
                        if (!isAUpcoming && isBUpcoming) return 1;

                        if (isAClosed && !isBClosed) return 1;
                        if (!isAClosed && isBClosed) return -1;

                        return 0;
                    });
                    setAuctions(fetchedAuctions);
                    setPageLoading(false);
                }
            });
        }
    }, [bids]);

    const handleAuctionClick = (auction) => {
        setAuctionKey(auction.key);
        setPage('auction-detail');
    }
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    }
    const renderer = ({days, hours, minutes, seconds, completed}) => {
        if (completed) {
            return <Completionist/>;
        } else {
            return (
                <div style={{fontWeight: 'bold', color: '#000000', fontSize: '22px'}}>
                    <div>{days}d {hours}h {minutes}m {seconds}s</div>
                </div>
            );
        }
    };
    const Completionist = () => <div>The auction was finished</div>;

    return (
        <Flex gap="small" vertical>
            <div className="auction-card">
                {auctions.length ? (
                    <>
                        <Flex wrap="wrap" justify="flex-start" gap="20px">
                            {auctions.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                                <Card
                                    key={item.key}
                                    hoverable
                                    style={{ width: 320 }}
                                    cover={
                                        <img
                                            alt={item.name}
                                            src={
                                                item.auction_thumbnail
                                                    ? item.auction_thumbnail
                                                    : "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"
                                            }
                                            style={{padding:'20px'}}
                                        />
                                    }
                                    onClick={() => handleAuctionClick(item)}
                                >
                                    <Meta
                                        style={{textAlign:"center"}}
                                        title={item.name}
                                        description={
                                            <>
                                                {new Date(item.start_date) < Date.now() && new Date(item.end_date) > Date.now() && (
                                                    <>
                                                        <Tag color="green">Running</Tag>
                                                        <Flex horizontal gap="middle" justify="center">
                                                            <div>
                                                                <p>Auction Type:</p>
                                                                <div style={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    color: '#000'
                                                                }}
                                                                >
                                                                    {item.auction_type === 'live-auction' ? 'LIVE AUCTION' : 'SEALED-BID AUCTION'}
                                                                </div>
                                                            </div>
                                                            { item.auction_type === 'live-auction' && (
                                                                <div>
                                                                    <p>Current Bid:</p>
                                                                    <div
                                                                        style={{
                                                                            fontWeight: 'bold',
                                                                            fontSize: '16px',
                                                                            color: '#000'
                                                                        }}
                                                                    >
                                                                        {item.end_price
                                                                            ? `$${item.end_price}`
                                                                            : `$${item.start_price}`}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            { item.auction_type === 'sealed-auction' && (
                                                                <div>
                                                                    <p>Start Price:</p>
                                                                    <div
                                                                        style={{
                                                                            fontWeight: 'bold',
                                                                            fontSize: '16px',
                                                                            color: '#000'
                                                                        }}
                                                                    >
                                                                        ${item.start_price}
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </Flex>
                                                        <p>Time remaining:</p>
                                                        <Countdown date={Date.now() + (new Date(item.end_date) - Date.now())} renderer={renderer}>
                                                            <Completionist/>
                                                        </Countdown>
                                                    </>
                                                )}
                                                {new Date(item.end_date) < Date.now() && (
                                                    <>
                                                        <Tag color="gold">Closed</Tag>
                                                        <Flex horizontal gap="middle" justify="center">
                                                            <div>
                                                                <p>Auction Type:</p>
                                                                <div style={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    color: '#000'
                                                                }}
                                                                >
                                                                    {item.auction_type === 'live-auction' ? 'LIVE AUCTION' : 'SEALED-BID AUCTION'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p>Winning Bid:</p>
                                                                <div
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                        fontSize: '16px',
                                                                        color: '#000'
                                                                    }}
                                                                >
                                                                    {item.end_price
                                                                        ? `$${item.end_price}`
                                                                        : "No winner"}
                                                                </div>
                                                            </div>
                                                        </Flex>
                                                    </>

                                                )}
                                            </>
                                        }
                                    />
                                </Card>
                            ))}
                        </Flex>
                        <Flex justify="center" style={{marginTop: '20px'}}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={auctions.length}
                                onChange={handlePageChange}
                            />
                        </Flex>
                    </>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '10%', marginBottom: '10%'}}>
                        {pageLoading ? (
                            <LoadingOutlined style={{fontSize: '60px'}}/>
                        ) : (
                            <div>You have no bid at the moment.</div>
                        )}
                    </div>
                )}
            </div>
        </Flex>
    );
}
