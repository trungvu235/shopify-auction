import {Button, Flex, theme, Tag, Card, Pagination} from "antd";
import {LeftOutlined, LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {getActiveListApi} from "@/utils/apis";
import Countdown from "react-countdown";

const { Meta } = Card;
export default function ActiveList({page, setPage, auctionKey, setAuctionKey}) {
    const [activeAuctions, setActiveAuctions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    useEffect(() => {
        getActiveListApi().then(response => {
            if (response) {
                setActiveAuctions(response.response.data.getActiveAuctions.slice().reverse());
            }
        });
    }, []);

    useEffect(() => {
        if (activeAuctions) {
            console.log(activeAuctions);
        }
    }, [activeAuctions]);

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

    const navigateToMain = () => {
        setPage('main-page');
    }
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Flex gap="small" vertical>
            <div className="auction-card">
                {activeAuctions.length ? (
                    <>
                        <Flex wrap="wrap" justify="flex-start" gap="20px">
                            {activeAuctions.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
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
                                total={activeAuctions.length}
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
    );
}
