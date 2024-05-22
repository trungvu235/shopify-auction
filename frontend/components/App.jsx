import { useEffect, useState } from "react";
import { Spinner } from '@shopify/polaris';
import LoginPage from "~/components/LoginPage";
import MainPage from "~/components/MainPage";
import AuctionsList from "@/components/RewardList";
import LayoutPage from "@/components/Layout";
import UpcomingList from "@/components/UpcomingList";
import ActiveList from "@/components/ActiveList";

export default function App({ home }) {
    const modal = document.getElementById("major-popup-parent");
    const [customer, setCustomer] = useState(null);
    const [shop, setShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState('main-page');
    console.log(page);
    useEffect(() => {
        if (window.shopifyCustomer.id !== "") {
            setCustomer(window.shopifyCustomer);
        } else {
            setPage( 'login-page');
        }

        if (window.shop) {
            setShop(window.shop);
        }

        setIsLoading(false);
    }, []);

    const PopupHandler = () => {
        if (modal.style.display !== "block") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    };

    if (isLoading) {
        return (
            <div className="tw-text-5xl tw-text-red-600">
                <button id="major-popup-button" onClick={PopupHandler}></button>
                <div id="major-popup-parent">
                    <div><Spinner accessibilityLabel="Loading" size="large"></Spinner></div>
                </div>
            </div>
        )
    }
    const loginPageComponent = <LoginPage shop={shop}></LoginPage>;
    const mainPageComponent = <MainPage page={page} setPage={setPage}></MainPage>;
    const rewardListComponent = <AuctionsList page={page} setPage={setPage}></AuctionsList>;
    const upcomingListComponent = <UpcomingList page={page} setPage={setPage}></UpcomingList>
    const activeListComponent = <ActiveList page={page} setPage={setPage}></ActiveList>

    return (
        <div className="tw-text-5xl tw-text-red-600">
            <button id="major-popup-button" onClick={PopupHandler}></button>
            <div id="major-popup-parent">
                {page === 'login-page' && (
                    <div id="login-page" className={`popup-page ${page === 'login-page' ? 'active' : ''}`}>
                        <LayoutPage customer={customer} shop={shop} childComponent={loginPageComponent}/>
                    </div>
                )}
                {page === 'main-page' && (
                    <div id="main-page" className={`popup-page ${page === 'main-page' ? 'active' : ''}`}>
                        <LayoutPage customer={customer} shop={shop} childComponent={mainPageComponent}/>
                    </div>
                )}
                {page === 'auctions-list' && (
                    <div id="reward-list" className={`popup-page ${page === 'auctions-list' ? 'active' : ''}`}>
                        <LayoutPage customer={customer} shop={shop} childComponent={rewardListComponent}/>
                    </div>
                )}
                {page === 'upcoming-list' && (
                    <div id="upcoming-list" className={`popup-page ${page === 'upcoming-list' ? 'active' : ''}`}>
                        <LayoutPage customer={customer} shop={shop} childComponent={upcomingListComponent}/>
                    </div>
                )}
                {page === 'active-list' && (
                    <div id="active-list" className={`popup-page ${page === 'active-list' ? 'active' : ''}`}>
                        <LayoutPage customer={customer} shop={shop} childComponent={activeListComponent}/>
                    </div>
                )}
            </div>
        </div>
    );
}
