import { Flex, theme, Tag, Card, Pagination} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {testFetch} from "@/utils/apis";
import React, {useEffect, useState} from "react";
import Countdown from 'react-countdown';

const { Meta } = Card;

export default function MainPage({page, setPage, auctionKey, setAuctionKey}) {
    const [auctions, setAuctions] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

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

    useEffect(() => {
        testFetch().then(response => {
            if (response) {
                setAuctions(response.response.data.getAuctions.slice().reverse());
            }
            setPageLoading(false);
        });
    }, []);

    const handleAuctionClick = (auction) => {
        setAuctionKey(auction.key);
        setPage('auction-detail');
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    }

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

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
                                                {new Date(item.start_date) > Date.now() && (
                                                    <>
                                                        <Tag color="blue">Upcoming</Tag>
                                                        <span
                                                            style={{
                                                                color:'#fff',
                                                                background:'rgb(230,159,98)',
                                                                position:'absolute',
                                                                top:'10px',
                                                                left:'10px',
                                                                padding:'8px',
                                                                borderRadius:'2px'
                                                            }}
                                                        >
                                                            Starting soon
                                                        </span>
                                                        <Flex horizontal gap="middle" justify="center">
                                                            <div>
                                                                <p>AUCTION TYPE:</p>
                                                                <div style={{
                                                                        fontWeight: 'bold',
                                                                        fontSize: '14px',
                                                                        color: '#000'
                                                                    }}
                                                                >
                                                                    {item.auction_type === 'live-auction' ? 'LIVE AUCTION' : 'REVERSE AUCTION'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p>START PRICE:</p>
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
                                                        </Flex>

                                                        <div style={{textAlign: "center"}}>
                                                            <p>Open for bids in:</p>
                                                            <Countdown
                                                                date={Date.now() + (new Date(item.start_date) - Date.now())}
                                                                renderer={renderer}>
                                                                <Completionist/>
                                                            </Countdown>
                                                        </div>
                                                    </>
                                                )}
                                                {new Date(item.start_date) < Date.now() && new Date(item.end_date) > Date.now() && (
                                                    <>
                                                        <Tag color="green">Running</Tag>
                                                        <Flex horizontal gap="middle" justify="center">
                                                            <div>
                                                                <p>AUCTION TYPE:</p>
                                                                <div style={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    color: '#000'
                                                                }}
                                                                >
                                                                    {item.auction_type === 'live-auction' ? 'LIVE AUCTION' : 'REVERSE AUCTION'}
                                                                </div>
                                                            </div>
                                                            { item.auction_type === 'live-auction' && (
                                                                <div>
                                                                    <p>CURRENT BID:</p>
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
                                                            { item.auction_type === 'reverse-auction' && (
                                                                <div>
                                                                    <p>START PRICE:</p>
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
                                                        <Countdown
                                                            date={Date.now() + (new Date(item.end_date) - Date.now())}
                                                            renderer={renderer}>
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
                                                                    {item.auction_type === 'live-auction' ? 'LIVE AUCTION' : 'REVERSE AUCTION'}
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
                            <div>There is no auction at the moment.</div>
                        )}
                    </div>
                )}
            </div>
        </Flex>
    )
}
