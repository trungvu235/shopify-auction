import {Button, Flex, Avatar, List, Tag} from "antd";
import {LeftOutlined, LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {testFetch} from "@/utils/apis";

export default function AuctionsList({page, setPage, auctionKey, setAuctionKey}) {
    const [auctions, setAuctions] = useState([]);
    const [displayAuctions, setDisplayAuctions] = useState([]);

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

    const navigateToMain = () => {
        setPage('main-page');
    }
    const handleAuctionClick = (auction) => {
        setAuctionKey(auction.key);
        setPage('auction-detail');
    }

    return (
        <div style={{height:"100%"}}>
            <div>
                <Flex gap="small" justify="flex-start" align="center">
                    <Button type="text" icon={<LeftOutlined/>} onClick={navigateToMain} style={{display: 'flex'}}></Button>
                    <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>All auctions</p>
                </Flex>
            </div>
            {displayAuctions.length ? (
                <div style={{backgroundColor:"#ffffff", borderRadius:"5px", paddingBottom:"20px"}}>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        dataSource={displayAuctions}
                        renderItem={(item) => (
                            <List.Item
                                key={item.key}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar src={item.auction_thumbnail ?
                                            item.auction_thumbnail :
                                            'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'} />
                                    }
                                    title={
                                        <div>
                                            <div>
                                                <Button type="link" onClick={() => handleAuctionClick(item)}>
                                                    {item.name}
                                                </Button>
                                            </div>
                                            {new Date(item.start_date) > Date.now() && (
                                                <Tag color="blue" >Scheduled</Tag>
                                            )}
                                            {new Date(item.start_date) < Date.now() && new Date(item.end_date) > Date.now() && (
                                                <Tag color="green" >Active</Tag>
                                            )}
                                            {new Date(item.end_date) < Date.now() && (
                                                <Tag color="gold" >Completed</Tag>
                                            )}
                                        </div>
                                    }
                                    description={item.end_price ? `Current bid: $${item.end_price}`
                                        : `No bids on this auction yet.`}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            ) : (
                <div style={{display:'flex', justifyContent:'center', marginTop:'20%'}}>
                    <LoadingOutlined style={{fontSize:'60px'}}/>
                </div>
            )}
        </div>
    );
}
