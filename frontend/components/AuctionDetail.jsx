import {Button, Flex, Layout, Space, theme, Avatar, List, Tag, Image} from "antd";
import React, {useEffect, useState} from "react";
import LoginPage from "~/components/LoginPage";
import {testFetch, getAuctionDetail} from "@/utils/apis";
import {LeftOutlined, LoadingOutlined} from "@ant-design/icons";
import Countdown from 'react-countdown';
import {BlockStack, InlineStack, Text} from "@shopify/polaris";

export default function AuctionDetail({page, setPage, auctionKey, setAuctionKey}) {
    const [auctionDetail, setAuctionDetail] = useState();
    const [product, setProduct] = useState();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getAuctionDetail(auctionKey).then(response => {
            if (response) {
                console.log(response);
                setAuctionDetail(response.auctionDetail);
                setProduct(response.product);
            }
        });
    }, []);
    useEffect(() => {
        if (auctionDetail) {
            setStartDate(new Date(auctionDetail.start_date));
            setEndDate(new Date(auctionDetail.end_date));
        }
    }, [auctionDetail]);

    console.log(`end date 1: ${endDate}`);
    const renderer = ({days, hours, minutes, seconds, completed}) => {
        if (completed) {
            return <Completionist/>;
        } else {
            return (
                <div style={{fontWeight:'bold', color:'#000000', marginLeft:'10px'}}>
                    <div>{days}d {hours}h {minutes}m {seconds}s</div>
                </div>
            );
        }
    };
    const Completionist = () => <div>The auction was finished</div>;
    const navigateToMain = () => {
        setPage('main-page');
    }

    return (
        <div style={{height: "100%"}}>
            <div>
                <Flex gap="small" justify="flex-start" align="center">
                    <Button type="text" icon={<LeftOutlined/>} onClick={navigateToMain}
                            style={{display: 'flex'}}></Button>
                    {auctionDetail ? (
                        <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                            {auctionDetail.name}
                        </p>
                    ) : (
                        <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                            Loading...
                        </p>
                    )}
                </Flex>
            </div>
            {auctionDetail ? (
                <div style={{backgroundColor: "#ffffff", borderRadius: "5px", paddingBottom: "20px"}}>
                    <Flex gap="middle" align="center" vertical>
                        <Image
                            width={'100%'}
                            src={product.image !== null ? product.image.src : 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'}
                            preview={false}
                        />
                    </Flex>
                    {startDate && endDate && (
                        <div style={{marginLeft: '10px'}}>
                        <span style={{fontSize: '18px'}}>{product.title}</span>
                            {startDate > Date.now() && (
                                <div>
                                    <div style={{display: 'flex', fontSize:'16px'}}>
                                        <div>Start in:</div>
                                        <Countdown date={Date.now() + (startDate - Date.now())} renderer={renderer}>
                                            <Completionist/>
                                        </Countdown>
                                    </div>
                                    <div style={{fontSize: '12px', color: 'rgba(18, 18, 18, 0.75)'}}>
                                        Start date: {startDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                        hour12: true
                                    })}
                                    </div>
                                </div>
                            )}
                        {startDate < Date.now() && endDate > Date.now && (
                            <div>
                                <div style={{display: 'flex', fontSize:'16px'}}>
                                    <div>Time remaining:</div>
                                    <Countdown date={Date.now() + (endTime - Date.now())} renderer={renderer}>
                                        <Completionist/>
                                    </Countdown>
                                </div>
                                <div style={{fontSize: '12px', color: 'rgba(18, 18, 18, 0.75)'}}>
                                    End date: {endTime.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                    hour12: true
                                        })}
                                    </div>
                                </div>
                            )}
                    </div>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20%',
                }}>
                    <LoadingOutlined style={{fontSize: '60px'}}/>
                </div>
            )}
        </div>
    )
}
