import {Button, Flex, theme, Tag, Card, Pagination} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {testFetch} from "@/utils/apis";
import React, {useEffect, useState} from "react";
import Countdown from 'react-countdown';

const { Meta } = Card;

export default function MainPage({page, setPage, auctionKey, setAuctionKey}) {
    const [auctions, setAuctions] = useState([]);
    const [displayAuctions, setDisplayAuctions] = useState([]);
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
                setAuctions(response.response.data.getAuctions);
            }
        });
    }, []);

    useEffect(() => {
        if (auctions) {
            setDisplayAuctions(auctions.slice().reverse());
        }
    }, [auctions]);

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
                {displayAuctions.length ? (
                    <>
                        <Flex wrap="wrap" justify="flex-start" gap="20px">
                            {displayAuctions.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
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
                                                        <div style={{lineHeight:'14px', padding:'0'}}>
                                                            <p>START PRICE:</p>
                                                            <p
                                                                style={{
                                                                    fontWeight:'bold',
                                                                    fontSize: '20px',
                                                                    color: '#000'
                                                                }}
                                                            >
                                                                ${item.start_price}
                                                            </p>
                                                        </div>
                                                        <div style={{textAlign: "center"}}>
                                                            <p>Open for bids in:</p>
                                                            <Countdown date={Date.now() + (new Date(item.start_date) - Date.now())} renderer={renderer}>
                                                                <Completionist/>
                                                            </Countdown>
                                                        </div>
                                                    </>
                                                )}
                                                {new Date(item.start_date) < Date.now() && new Date(item.end_date) > Date.now() && (
                                                    <>
                                                        <Tag color="green">Running</Tag>
                                                        <div>
                                                            <p>CURRENT BID:</p>
                                                            <p
                                                                style={{
                                                                    fontWeight:'bold',
                                                                    fontSize: '20px',
                                                                    color: '#000'
                                                                }}
                                                            >
                                                                {item.end_price
                                                                    ? `$${item.end_price}`
                                                                    : `$${item.start_price}`}
                                                            </p>
                                                        </div>
                                                        <p>Time remaining:</p>
                                                        <Countdown date={Date.now() + (new Date(item.end_date) - Date.now())} renderer={renderer}>
                                                            <Completionist/>
                                                        </Countdown>
                                                    </>
                                                    )}
                                                {new Date(item.end_date) < Date.now() && (
                                                    <>
                                                        <Tag color="gold">Closed</Tag>
                                                        <div>
                                                            <p>END BID:</p>
                                                            <p
                                                                style={{
                                                                    fontWeight:'bold',
                                                                    fontSize: '20px',
                                                                    color: '#000'
                                                                }}
                                                            >
                                                                {item.end_price
                                                                    ? `$${item.end_price}`
                                                                    : "No bids on this auction yet."}
                                                            </p>
                                                        </div>
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
                                total={displayAuctions.length}
                                onChange={handlePageChange}
                            />
                        </Flex>
                    </>
                ) : (
                    <div style={{display:'flex', justifyContent:'center', marginTop:'20%'}}>
                        <LoadingOutlined style={{fontSize:'60px'}}/>
                    </div>
                )}
            </div>
        </Flex>
    )
}