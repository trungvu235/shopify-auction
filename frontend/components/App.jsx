import React, { useEffect, useState } from "react";
import LoginPage from "~/components/LoginPage";
import MainPage from "~/components/MainPage";
import AuctionsList from "@/components/AuctionsList";
import LayoutPage from "@/components/Layout";
import UpcomingList from "@/components/UpcomingList";
import ActiveList from "@/components/ActiveList";
import AuctionDetail from "@/components/AuctionDetail";
import {LoadingOutlined} from "@ant-design/icons";

export default function App({ home }) {
    const modal = document.getElementById("major-popup-parent");
    const overlay = document.getElementById("overlay");
    const [customer, setCustomer] = useState(null);
    const [shop, setShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState('main-page');
    const [auctionKey, setAuctionKey] = useState('');

    console.log('test4');

    useEffect(() => {
        if(window.shopifyCustomer){
            if(window.shopifyCustomer.id !== ""){
                setCustomer(window.shopifyCustomer);
            } else {
                setPage( 'login-page');
            }
        } else {
            setPage( 'login-page');
        }
        if (window.shop) {
            setShop(window.shop);
        }
        setIsLoading(false);

    }, [window.shopifyCustomer]);

    const PopupHandler = () => {
        if (modal.style.display === "block") {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        } else {
            modal.style.display = 'block';
            overlay.style.display = 'block';
        }
    };

    const loginPageComponent = <LoginPage shop={shop}></LoginPage>;
    const mainPageComponent = <MainPage page={page} setPage={setPage} auctionKey={auctionKey} setAuctionKey={setAuctionKey}></MainPage>;
    const auctionsListComponent = <AuctionsList page={page} setPage={setPage} auctionKey={auctionKey} setAuctionKey={setAuctionKey}></AuctionsList>;
    const upcomingListComponent = <UpcomingList page={page} setPage={setPage} auctionKey={auctionKey} setAuctionKey={setAuctionKey}></UpcomingList>
    const activeListComponent = <ActiveList page={page} setPage={setPage} auctionKey={auctionKey} setAuctionKey={setAuctionKey}></ActiveList>
    const auctionDetailComponent = <AuctionDetail page={page} setPage={setPage} auctionKey={auctionKey} setAuctionKey={setAuctionKey}></AuctionDetail>

    return (
        <>
            {isLoading ? (
                <div className="tw-text-5xl tw-text-red-600">
                    <button id="major-popup-button" onClick={PopupHandler}></button>
                    <div id="overlay"></div>
                    <div id="major-popup-parent">
                        <div><LoadingOutlined style={{fontSize: '60px'}}/></div>
                    </div>
                </div>
            ) : (
                <div className="tw-text-5xl tw-text-red-600">
                    <button id="major-popup-button" onClick={PopupHandler}></button>
                    <div id="overlay"></div>
                    <div id="major-popup-parent">
                        {page === 'login-page' && (
                            <div id="login-page" className={`popup-page ${page === 'login-page' ? 'active' : ''}`}>
                                <LayoutPage customer={customer} shop={shop} childComponent={loginPageComponent}/>
                            </div>
                        )}
                        {page === 'main-page' && (
                            <div id="main-page" className={`popup-page ${page === 'main-page' ? 'active' : ''}`}>
                                <LayoutPage customer={customer} shop={shop} page={page} setPage={setPage} childComponent={mainPageComponent}/>
                            </div>
                        )}
                        {page === 'auctions-list' && (
                            <div id="auctions-list" className={`popup-page ${page === 'auctions-list' ? 'active' : ''}`}>
                                <LayoutPage customer={customer} shop={shop} page={page} setPage={setPage} childComponent={auctionsListComponent}/>
                            </div>
                        )}
                        {page === 'upcoming-list' && (
                            <div id="upcoming-list" className={`popup-page ${page === 'upcoming-list' ? 'active' : ''}`}>
                                <LayoutPage customer={customer} shop={shop} page={page} setPage={setPage} childComponent={upcomingListComponent}/>
                            </div>
                        )}
                        {page === 'active-list' && (
                            <div id="active-list" className={`popup-page ${page === 'active-list' ? 'active' : ''}`}>
                                <LayoutPage customer={customer} shop={shop} page={page} setPage={setPage} childComponent={activeListComponent}/>
                            </div>
                        )}
                        {page === 'auction-detail' && (
                            <div id="auction-detail" className={`popup-page ${page === 'auction-detail' ? 'active' : ''}`}>
                                <LayoutPage customer={customer} shop={shop} page={page} setPage={setPage} childComponent={auctionDetailComponent}/>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
