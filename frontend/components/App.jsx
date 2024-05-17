import { useEffect, useState } from "react";
import { Spinner } from '@shopify/polaris';
import LoginPage from "~/components/LoginPage";
import {testFetch} from "@/utils/apis";
import {Button} from "antd";

export default function App({ home }) {
    const modal = document.getElementById("major-popup-parent");
    const major_popup_btn = document.getElementById("major-popup-button");

    const [customer, setCustomer] = useState(null);
    const [shop, setShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (window.shopifyCustomer.id !== "") {
            setCustomer(window.shopifyCustomer);
        }
        setShop(window.shop);

        setIsLoading(false);
    }, []);

    const PopupHandler = () => {
        if (modal.style.display !== "block") {
            modal.style.display = "block";
        } else {
            modal.style.display = "none";
        }
    };
    const test = async () => {
        await testFetch().then(
            response => {
                console.log(response);
            }
        );
    }
    const PopupClose = function () {
        modal.style.display = "none";
    }

    const RegButtonHandler = function () {
        window.location.href = `https://${shop.domain}/account/register`;
    }

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

    return (
        <div className="tw-text-5xl tw-text-red-600">
            <button id="major-popup-button" onClick={PopupHandler}></button>
            <div id="major-popup-parent">
                <div id="top-major-content">
                    <div id="fixed-top" style={{ float: "right", width: "100%" }}>
                        <div id="close-tag" style={{ position: "absolute", right: "0", width: "fit-content" }}>
                            <button id="close-popup" onClick={PopupClose}>&times;</button>
                        </div>
                        {customer ? (
                            <div style={{ paddingLeft: "10px", paddingBottom: "5px" }}>
                                <p className="overflow-text" style={{ width: "340px" }}>
                                    Welcome {customer.name}!
                                </p>
                                <p className="common-text" style={{ fontSize: "20px", fontWeight: "bold" }}>
                                    Let's go see the auctions
                                </p>
                                <Button type="primary" onClick={test}>Test Api</Button>
                            </div>
                        ) : (
                            <div style={{ paddingLeft: "10px", paddingBottom: "5px" }}>
                                <p className="common-text" style={{ fontWeight: "bold" }}>
                                    Welcome to
                                </p>
                                <p className="overflow-text" style={{ fontSize: "20px", fontWeight: "bolder", width: "340px" }}>
                                    {shop.name}
                                </p>
                            </div>)}
                    </div>
                </div>
                <div id="major-content">
                    {customer ? (
                        <div id="main-content">
                        </div>
                    ) : (
                        <div id="main-content">
                            <div className="card-content">
                                <p style={{ fontWeight: "bold", fontSize: "15px", textAlign: "center" }}>
                                    Become our membership
                                </p>
                                <p style={{ fontWeight: "light", fontSize: "12px", textAlign: "center" }}>
                                    With more ways to unlock exciting perks, this is your all access pass to exclusive rewards.
                                </p>
                            </div>
                            <div className="card-content" style={{ left: "50%", top: "60%", width: "30%" }}>
                                <button id="register-button" onClick={RegButtonHandler}>Join now</button>
                            </div>
                            <div className="card-content" style={{ left: "50%", top: "90%", width: "70%" }}>
                                <p style={{ fontWeight: "light", fontSize: "12px", textAlign: "center" }}>
                                    Already have an account?
                                    <a href={`https://${shop.domain}/account/login`} style={{ textDecoration: "none" }}> Sign in</a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div id="footer-major-content">
                    <div id="footer-banner">
                        <p style={{ fontSize: "15px", textAlign: "center", fontWeight: "bold" }}>
                            Shopify Auctions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
