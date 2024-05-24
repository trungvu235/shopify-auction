import {Button, Flex, theme, Divider} from "antd";
import {RightOutlined} from "@ant-design/icons";

export default function MainPage({page, setPage}) {

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const navigateToAuctionsList = () => {
        setPage('auctions-list');
    }

    const navigateToUpcomingList = () => {
        setPage('upcoming-list');
    }

    const navigateToActiveList = () => {
        setPage('active-list');
    }

    const navigateToUserActivity = () => {
        setPage('user-activity');
    }

    return (
        <Flex gap="small" vertical>
            <div style={{
                padding: "6px 24px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}>
                <Flex gap="middle" justify="start" align="center">
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <img style={{width:"40px", height:"40px"}}
                             alt=""
                             src="https://cdn-icons-png.flaticon.com/128/3898/3898671.png"
                        />
                    </div>
                    <div>
                        <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                            Welcome, {window.shopifyCustomer.name}!
                        </p>
                    </div>
                </Flex>
            </div>
            <div style={{
                padding: "6px 24px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}>
                <Flex gap="middle" justify="center" horizontal>
                    <Flex gap="large" align="center">
                        <div style={{
                            width: "75%"
                        }}>
                            <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                                All Auctions
                            </p>
                        </div>
                        <div style={{
                            width: "10%"
                        }}>
                            <Button type="text" icon={<RightOutlined/>} onClick={navigateToAuctionsList}
                                    style={{display: 'flex'}}></Button>
                        </div>
                    </Flex>
                    <Flex gap="large" align="center">
                        <div style={{
                            width: "75%"
                        }}>
                            <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                                Active auctions
                            </p>
                        </div>
                        <div style={{
                            width: "10%"
                        }}>
                            <Button type="text" icon={<RightOutlined/>} onClick={navigateToActiveList}
                                    style={{display: 'flex'}}></Button>
                        </div>
                    </Flex>
                    <Flex gap="large" align="center">
                        <div style={{
                            width: "75%"
                        }}>
                            <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                                Upcoming auctions
                            </p>
                        </div>
                        <div style={{
                            width: "10%"
                        }}>
                            <Button type="text" icon={<RightOutlined/>} onClick={navigateToUpcomingList}
                                    style={{display: 'flex'}}></Button>
                        </div>
                    </Flex>
                </Flex>
            </div>

            <div style={{
                padding: "6px 24px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}>

                <Flex gap="small" justify="flex-end" align="center">
                    <div style={{
                        width: "15%"
                    }}>
                        <img alt="" src="https://cdn-icons-png.flaticon.com/32/2961/2961948.png"/>
                    </div>
                    <div style={{
                        width: "75%"
                    }}>
                        <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                            Your activity
                        </p>
                    </div>
                    <div style={{
                        width: "10%"
                    }}>
                        <Button type="text" icon={<RightOutlined/>} onClick={navigateToUserActivity}
                                style={{display: 'flex'}}></Button>
                    </div>
                </Flex>
            </div>
        </Flex>
)
}
