import {Button, Flex, theme, Tag, Image, Card, Col, Row, Breadcrumb, InputNumber, Cascader} from "antd";
import React, {useEffect, useState} from "react";
import LoginPage from "~/components/LoginPage";
import {getAuctionDetail, getCustomerAuctionsApi} from "@/utils/apis";
import {LeftOutlined, LoadingOutlined} from "@ant-design/icons";
import Countdown from 'react-countdown';
import {UPDATE_AUCTION, CREATE_BID} from "../../app/graphql/mutation";
import client from "../../app/graphql/client";
import {apiLink} from "../utils/apis";
import PhoneInput from 'react-phone-number-input'

export default function AuctionDetail({page, setPage, auctionKey, setAuctionKey}) {
    const [auctionDetail, setAuctionDetail] = useState();
    const [product, setProduct] = useState();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [auctionStatus, setAuctionStatus] = useState('');
    const [bidder, setBidder] = useState();
    const [currentBid, setCurrentBid] = useState();
    const [nextBid, setNextBid] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState();

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
        getCustomerAuctionsApi(window.shopifyCustomer.id).then(responseApi => {
            if (responseApi) {
                console.log(responseApi.customerAuctions);
            }
        });
    }, []);
    useEffect(() => {
        if (auctionDetail) {
            setStartDate(new Date(auctionDetail.start_date));
            setEndDate(new Date(auctionDetail.end_date));
            setCurrentBid(auctionDetail.end_price? auctionDetail.end_price : auctionDetail.start_price);
        }
    }, [auctionDetail]);

    useEffect(() => {
        if (currentBid) {
            setNextBid(currentBid + auctionDetail.bid_increment);
        }
    }, [currentBid]);

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

    const renderer = ({days, hours, minutes, seconds, completed}) => {
        if (completed) {
            return <Completionist/>;
        } else {
            return (
                <div style={{fontWeight: 'bold', color: '#000000', fontSize: '24px'}}>
                    <div>{days}d {hours}h {minutes}m {seconds}s</div>
                </div>
            );
        }
    };
    const Completionist = () => <div>The auction was finished</div>;
    const navigateToMain = () => {
        setPage('main-page');
    }
    const navigateToRunningList = () => {
        setPage('active-list');
    }
    const navigateToUpcomingList = () => {
        setPage('upcoming-list');
    }
    const handleNextBidChange = (value) => {
        setNextBid(value);
    };
    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value);
        console.log(value);
    };
    const handlePlaceBid = () => {
        console.log(nextBid);
        console.log(phoneNumber);
        try {
            const responseUpdate = client.mutate({
                mutation: UPDATE_AUCTION,
                variables: {
                    input: {
                        id: auctionDetail.id,
                        key: auctionDetail.key,
                        end_price: parseFloat(nextBid),
                        winner_id: window.shopifyCustomer.id,
                        contact_number: phoneNumber,
                    }
                }
            });
            console.log('update successfully');
        } catch (error) {
            console.error(error);
        }
        try {
            const responseCreate = client.mutate({
                mutation: CREATE_BID,
                variables: {
                    input: {
                        id: window.shopifyCustomer.id,
                        key: auctionDetail.key,
                    }
                }
            });
            console.log('create successfully');
        } catch (error) {
            console.error(error);
        }
        getNewData();
    };

    const getNewData = () => {
        setAuctionDetail(null);
        getAuctionDetail(auctionKey).then(response => {
            if (response) {
                console.log(response);
                setAuctionDetail(response.auctionDetail);
                setProduct(response.product);
                setBidder(response.winner);
            }
        });
    };

    const handlePlaceReservePrice = () => {
        setNextBid(auctionDetail.reserve_price)
    };

    const handlePlaceBuyoutPrice = () => {
        const newEndDate = new Date(Date.now()).toISOString().slice(0, 16);
        console.log(newEndDate);
        try {
            const responseUpdate = client.mutate({
                mutation: UPDATE_AUCTION,
                variables: {
                    input: {
                        id: auctionDetail.id,
                        key: auctionDetail.key,
                        end_price: parseFloat(auctionDetail.buyout_price),
                        winner_id: window.shopifyCustomer.id,
                        contact_number: phoneNumber,
                        end_date: newEndDate,
                    }
                }
            });
            console.log('update successfully');
        } catch (error) {
            console.error(error);
        }
        try {
            const responseCreate = client.mutate({
                mutation: CREATE_BID,
                variables: {
                    input: {
                        id: window.shopifyCustomer.id,
                        key: auctionDetail.key,
                    }
                }
            });
            console.log('create successfully');
        } catch (error) {
            console.error(error);
        }
        getNewData();
    };

    return (
        <div style={{height: "100%"}}>
            <div>
                <Flex gap="small" justify="flex-start" align="center">
                    {auctionDetail ? (
                        <Breadcrumb
                            items={[
                                {
                                    title: <a onClick={(e) => navigateToMain()}>Home</a>,
                                },
                                auctionStatus !== 'completed' && {
                                    title: auctionStatus === 'active' ?
                                        <a onClick={(e) => navigateToRunningList()}>Running Auctions</a> :
                                        <a onClick={(e) => navigateToUpcomingList()}>Upcoming Auctions</a>,
                                },
                                {
                                    title: auctionDetail.name,
                                },
                            ].filter(Boolean)}
                        />
                    ) : (
                        <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                            Loading...
                        </p>
                    )}
                </Flex>
            </div>
            {auctionDetail ? (
                <div className="auction-detail">
                    <div className="auction-detail-container">
                        <div className="col-12 col-sm-12 col-md-6">
                            <Flex gap="middle" align="center" vertical style={{borderBottom: 'solid 1px #eaeaea'}}>
                                <Image
                                    width={'100%'}
                                    src={product.image !== null ? product.image.src : 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'}
                                    preview={false}
                                />
                            </Flex>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6">
                            {startDate && endDate && (
                                <div style={{
                                    margin: '10px 10px',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    border: 'solid 1px rgb(240, 240, 240)',
                                }}>
                                    {auctionStatus === 'scheduled' && (
                                        <div style={{ padding: '10px'}}>
                                            <Flex align="center" vertical>
                                                <div style={{
                                                    textAlign: 'center',
                                                    fontSize: '16px',
                                                    width: '100%',
                                                    borderRadius: '5px 5px 0px 0px',
                                                    color: '#000',
                                                    padding: '10px 0px 40px',
                                                    borderBottom: '1px solid #eaeaea'
                                                }}
                                                >
                                                    <span style={{fontSize: '28px', color: 'rgb(61, 8, 27)'}}>
                                                        {product.title}
                                                    </span>
                                                    <div>
                                                        <div>Open for bids in</div>
                                                        <Countdown date={Date.now() + (startDate - Date.now())}
                                                                   renderer={renderer}>
                                                            <Completionist/>
                                                        </Countdown>
                                                        <div
                                                            style={{fontSize: '12px', color: 'rgba(18, 18, 18, 0.75)'}}>
                                                            Start date: {endDate.toLocaleDateString('en-US', {
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
                                                </div>
                                                <div className="auction-infor-table" style={{width:'100%'}}>
                                                    <div style={{
                                                        marginTop: '10px 0',
                                                        padding: '10px 15px',
                                                        borderBottom: 'solid 1px #eaeaea'
                                                    }}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <strong>Start Price</strong>
                                                            <strong>
                                                                ${auctionDetail.start_price}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    {auctionDetail.is_reverse_price && (
                                                        <div style={{
                                                            marginTop: '10px 0',
                                                            padding: '10px 15px',
                                                            borderBottom: 'solid 1px #eaeaea'
                                                        }}>
                                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <strong>Reverse Price</strong>
                                                                <strong>
                                                                    ${auctionDetail.reserve_price}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {auctionDetail.is_buyout_price && (
                                                        <div style={{
                                                            marginTop: '10px 0',
                                                            padding: '10px 15px',
                                                            borderBottom: 'solid 1px #eaeaea'
                                                        }}>
                                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <strong>Buyout Price</strong>
                                                                <strong>
                                                                    ${auctionDetail.buyout_price}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        marginTop: '10px 0',
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
                                                    padding: '10px 0px 40px',
                                                    borderBottom: '1px solid #eaeaea'
                                                }}
                                                >
                                                    <span style={{fontSize: '28px', color: 'rgb(61, 8, 27)'}}>
                                                        {product.title}
                                                    </span>
                                                    <div>
                                                        <div>Close at</div>
                                                        <Countdown date={Date.now() + (endDate - Date.now())}
                                                                   renderer={renderer}>
                                                            <Completionist/>
                                                        </Countdown>
                                                        <div
                                                            style={{fontSize: '12px', color: 'rgba(18, 18, 18, 0.75)'}}>
                                                            Start date: {endDate.toLocaleDateString('en-US', {
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
                                                </div>
                                                <div className="auction-infor-table" style={{width:'100%'}}>
                                                    <div style={{
                                                        marginTop: '10px 0',
                                                        padding: '10px 15px',
                                                        borderBottom: 'solid 1px #eaeaea'
                                                    }}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <strong>Current bid</strong>
                                                            <strong>
                                                                ${currentBid}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        marginTop: '10px 0',
                                                        width: '100%',
                                                        padding: '10px 15px',
                                                        borderBottom: 'solid 1px #eaeaea'
                                                    }}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <strong>Bidder name</strong>
                                                            <strong>
                                                                {bidder? bidder.data.customer.displayName : 'no bidder'}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        marginTop: '10px 0',
                                                        width: '100%',
                                                        padding: '10px 15px',
                                                        borderBottom: 'solid 1px #eaeaea'
                                                    }}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <strong>Next minimum bid</strong>
                                                            <strong>
                                                                ${currentBid + auctionDetail.bid_increment}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    {auctionDetail.is_reverse_price && (
                                                        <div style={{
                                                            marginTop: '10px 0',
                                                            padding: '10px 15px',
                                                            borderBottom: 'solid 1px #eaeaea'
                                                        }}>
                                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <strong>Reverse Price</strong>
                                                                <strong>
                                                                    ${auctionDetail.reserve_price}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {auctionDetail.is_buyout_price && (
                                                        <div style={{
                                                            marginTop: '10px 0',
                                                            padding: '10px 15px',
                                                            borderBottom: 'solid 1px #eaeaea'
                                                        }}>
                                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <strong>Buyout Price</strong>
                                                                <strong>
                                                                    ${auctionDetail.buyout_price}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        marginTop: '10px 0',
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
                                                    <div style={{
                                                            marginTop: '10px 0',
                                                            width: '100%',
                                                            padding: '10px 15px',
                                                            borderBottom: 'solid 1px #eaeaea'
                                                    }}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <div>End at</div>
                                                            <strong>
                                                                {endDate.toLocaleString()}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="auction-place-bid-container" style={{
                                                    width: '100%',
                                                    padding: '20px 20px 20px 20px'
                                                }}>
                                                    <div style={{marginBottom:'10px'}}>
                                                        {nextBid && (
                                                            <Flex horizontal gap="middle" style={{flexWrap:'wrap'}}>
                                                                <strong style={{fontSize:"18px"}}>Place live bid</strong>
                                                                <Flex vertical gap="middle">
                                                                    <Flex horizontal gap="middle">
                                                                        <Flex vertical gap="middle">
                                                                            <InputNumber addonBefore="$" value={nextBid}
                                                                                         min={nextBid}
                                                                                         onChange={handleNextBidChange}/>
                                                                            <PhoneInput
                                                                                international
                                                                                countryCallingCodeEditable={false}
                                                                                defaultCountry="VN"
                                                                                placeholder="Enter phone number"
                                                                                value={phoneNumber}
                                                                                onChange={handlePhoneNumberChange}/>
                                                                        </Flex>

                                                                        <Button
                                                                            style={{background: "rgba(0, 21, 41,0.85)"}}
                                                                            type="primary"
                                                                            onClick={handlePlaceBid}
                                                                        >
                                                                            Place Bid
                                                                        </Button>
                                                                    </Flex>
                                                                    <Flex horizontal gap="middle" style={{flexWrap:'wrap'}}>
                                                                        {auctionDetail.is_reverse_price && auctionDetail.reserve_price > nextBid && (
                                                                            <Button
                                                                                style={{background: "rgba(0, 21, 41,0.85)"}}
                                                                                type="primary"
                                                                                onClick={handlePlaceReservePrice}
                                                                            >
                                                                                Place Bid with Reserve Price
                                                                            </Button>
                                                                        )}
                                                                        {auctionDetail.is_buyout_price && (
                                                                            <Button
                                                                                style={{background: "rgba(0, 21, 41,0.85)"}}
                                                                                type="primary"
                                                                                onClick={handlePlaceBuyoutPrice}
                                                                            >
                                                                                Place Bid with Buyout Price
                                                                            </Button>
                                                                        )}
                                                                    </Flex>
                                                                </Flex>

                                                            </Flex>
                                                        )}
                                                    </div>
                                                    <div>

                                                    </div>
                                                </div>
                                            </Flex>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
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
