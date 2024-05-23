import {Button, Flex, theme} from "antd";

export default function LoginPage({shop}) {

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const RegButtonHandler = function () {
        window.location.href = `https://${shop.domain}/account/login`;
    }


    return (
        <Flex gap="middle" vertical>
            <div style={{
                padding: "6px 24px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}>
                <p style={{fontWeight: "bold", fontSize: "16px", textAlign: "center"}}>
                    Become our membership
                </p>
                <p style={{fontWeight: "light", fontSize: "12px", textAlign: "center"}}>
                    Please sign in to view and join the auction.
                </p>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Button type="primary" onClick={RegButtonHandler}>Sign in</Button>
                </div>
                <p style={{fontWeight: "light", fontSize: "12px", textAlign: "center"}}>
                    Don't have an account?
                    <a href={`https://${shop.domain}/account/register`} style={{textDecoration: "none"}}> Sign up</a>
                </p>
            </div>
        </Flex>
    );
}
