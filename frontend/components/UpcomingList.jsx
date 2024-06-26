import {Flex, theme, Tag, Card, Pagination} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {getUpcomingListApi} from "@/utils/apis";
import Countdown from "react-countdown";

const { Meta } = Card;

export default function UpcomingList({page, setPage, auctionKey, setAuctionKey}) {
    const [upcomingAuctions, setUpcomingAuctions] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    useEffect(() => {
        getUpcomingListApi().then(response => {
            if (response) {
                setUpcomingAuctions(response.response.data.getScheduledAuctions.slice().reverse());
            }
            setPageLoading(false);
        });
    }, []);
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
                {upcomingAuctions.length ? (
                    <>
                        <Flex wrap="wrap" justify="flex-start" gap="20px">
                            {upcomingAuctions.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
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
                                                                    {item.auction_type === 'live-auction' ? 'LIVE AUCTION' : 'SEALED-BID AUCTION'}
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
                                                            <Countdown date={Date.now() + (new Date(item.start_date) - Date.now())} renderer={renderer}>
                                                                <Completionist/>
                                                            </Countdown>
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
                                total={upcomingAuctions.length}
                                onChange={handlePageChange}
                            />
                        </Flex>
                    </>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '10%', marginBottom:'10%'}}>
                        {pageLoading ? (
                            <LoadingOutlined style={{fontSize: '60px'}}/>
                        ) : (
                            <div>There is no upcoming auction at the moment.</div>
                        )}
                    </div>
                )}
            </div>
        </Flex>
    );
}
