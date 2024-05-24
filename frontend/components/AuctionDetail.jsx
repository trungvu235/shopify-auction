import {Button, Flex, Layout, Space, theme, Avatar, List, Tag, Image, Card} from "antd";
import React, {useEffect, useState} from "react";
import LoginPage from "~/components/LoginPage";
import {testFetch, getAuctionDetail} from "@/utils/apis";
import {LeftOutlined, LoadingOutlined} from "@ant-design/icons";
import Countdown from 'react-countdown';

export default function AuctionDetail({page, setPage, auctionKey, setAuctionKey}) {
    const [auctionDetail, setAuctionDetail] = useState();
    const [product, setProduct] = useState();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [auctionStatus, setAuctionStatus] = useState('');
    const [bidder, setBidder] = useState();

    useEffect(() => {
        getAuctionDetail(auctionKey).then(response => {
            if (response) {
                console.log(response);
                setAuctionDetail(response.auctionDetail);
                setProduct(response.product);
                setBidder(response.winner);
            }
        });
    }, []);
    useEffect(() => {
        if (auctionDetail) {
            setStartDate(new Date(auctionDetail.start_date));
            setEndDate(new Date(auctionDetail.end_date));
        }
    }, [auctionDetail]);

    useEffect(() => {
        if (startDate && endDate) {
            if (startDate > Date.now()) {
                setAuctionStatus('scheduled');
            }
            if (startDate < Date.now() && endDate > Date.now()) {
                setAuctionStatus('active');
            }
            if (endDate < Date.now()) {
                setAuctionStatus('completed');
            }
        }
    }, [endDate]);

    console.log(`end date 2: ${endDate}`);
    console.log(`status: ${auctionStatus}`);
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
    const navigateToMain = () => {
        setPage('main-page');
    }
    console.log(startDate < Date.now() && endDate > Date.now());

    return (
        <div style={{height: "100%"}}>
            <div>
                <Flex gap="small" justify="flex-start" align="center">
                    <Button type="text" icon={<LeftOutlined/>} onClick={navigateToMain}
                            style={{display: 'flex'}}></Button>
                    {auctionDetail ? (
                        <p style={{
                            fontWeight: "bold",
                            fontSize: "15px",
                            textAlign: "center",
                            display: 'flex',
                            color: '#3D081B'
                        }}>
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
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                        paddingBottom: "20px",
                        border: 'solid 1px #eaeaea',
                    }}
                >
                    <Flex gap="middle" align="center" vertical style={{borderBottom:'solid 1px #eaeaea'}}>
                        <Image
                            width={'100%'}
                            src={product.image !== null ? product.image.src : 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'}
                            preview={false}
                        />
                    </Flex>
                    {startDate && endDate && (
                        <div style={{margin: '10px 10px'}}>
                            {auctionStatus === 'scheduled' && (
                                <div
                                    style={{
                                        borderRadius: '0 0 8px 8px',
                                        boxSizing: 'border-box',
                                        border: 'solid 1px rgb(240, 240, 240)'
                                    }}
                                >
                                    <Flex align="center" vertical>
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                fontSize: '16px',
                                                width: '100%',
                                                borderRadius: '5px',
                                                color: '#000',
                                                padding: '10px 0'
                                            }}
                                        >
                                            <span style={{fontSize: '22px'}}>{product.title}</span>
                                            <div>Open for bids in</div>
                                            <Countdown date={Date.now() + (startDate - Date.now())} renderer={renderer}>
                                                <Completionist/>
                                            </Countdown>
                                            <div style={{fontSize: '12px', color: 'rgba(18, 18, 18, 0.75)'}}>
                                                Start on: {startDate.toLocaleDateString('en-US', {
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
                                        <div style={{marginTop: '10px 0'}}>
                                        <span style={{color: '#3D081B', fontSize: '32px', display: 'block'}}>
                                            ${auctionDetail.start_price}
                                        </span>
                                            <span style={{fontSize: '14px', color: 'rgba(18, 18, 18, 0.75)'}}>
                                            Starting price
                                        </span>
                                        </div>
                                        <div style={{marginTop: '20px'}}>

                                        </div>
                                    </Flex>
                                </div>
                            )}
                            {auctionStatus === 'active' && (
                                <div
                                    style={{
                                        borderRadius: '0 0 8px 8px',
                                        boxSizing: 'border-box',
                                        border: 'solid 1px rgb(240, 240, 240)'
                                    }}
                                >
                                    <Flex align="center" vertical>
                                        <div style={{
                                            textAlign: 'center',
                                            fontSize: '16px',
                                            width: '100%',
                                            borderRadius: '5px 5px 0px 0px',
                                            color: '#000',
                                            padding: '10px 0',
                                            borderBottom: '1px solid #eaeaea'
                                        }}
                                        >
                                            <span style={{fontSize: '22px', color: 'rgb(61, 8, 27)'}}>
                                                {product.title}
                                            </span>
                                            <div>Close at</div>
                                            <Countdown date={Date.now() + (endDate - Date.now())} renderer={renderer}>
                                                <Completionist/>
                                            </Countdown>
                                            <div style={{fontSize: '12px', color: 'rgba(18, 18, 18, 0.75)'}}>
                                                End date: {endDate.toLocaleDateString('en-US', {
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
                                        <div style={{
                                            marginTop: '10px 0',
                                            width: '100%',
                                            padding: '10px 15px',
                                            borderBottom: 'solid 1px #eaeaea'
                                        }}>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <strong>Current bid</strong>
                                                <strong>
                                                    ${auctionDetail.end_price ? auctionDetail.end_price : auctionDetail.start_price}
                                                </strong>
                                            </div>
                                        </div>
                                        {bidder && (
                                            <div style={{
                                                marginTop: '10px 0',
                                                width: '100%',
                                                padding: '10px 15px',
                                                borderBottom: 'solid 1px #eaeaea'
                                            }}>
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <strong>Bidder name</strong>
                                                    <strong>
                                                        bidder
                                                    </strong>
                                                </div>
                                            </div>
                                        )}
                                        <div style={{
                                            marginTop: '10px 0',
                                            width: '100%',
                                            padding: '10px 15px',
                                            borderBottom: 'solid 1px #eaeaea'
                                        }}>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div>Start at</div>
                                                <strong>
                                                    {startDate.toLocaleString()}
                                                </strong>
                                            </div>
                                        </div>
                                        <div style={{marginTop: '10px 0', width: '100%', padding: '10px 15px'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div>End at</div>
                                                <strong>
                                                    {endDate.toLocaleString()}
                                                </strong>
                                            </div>
                                        </div>
                                    </Flex>
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
