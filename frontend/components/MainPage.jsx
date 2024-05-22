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
        <Flex gap="middle" vertical>
            <div style={{
                padding: "6px 24px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}>
                <Flex gap="small" justify="flex-end" align="center">

                    <div style={{ width: "15%", display:"flex", justifyContent:"center"}}>
                        <img style={{width:"80%"}} alt="" src="https://cdn-icons-png.flaticon.com/128/3898/3898671.png"/>
                    </div>
                    <div style={{
                        width: "75%"
                    }}>
                        <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                            Hi {window.shopifyCustomer.name}!
                        </p>
                    </div>
                </Flex>
            </div>

            <div style={{
                padding: "6px 24px",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}>
                <Flex gap="small" justify="flex-end" align="center">
                    <div style={{
                        width: "15%",
                        display:"flex",
                        justifyContent:"center"
                    }}>
                        <img style={{width:"75%"}} alt="" src="https://cdn-icons-png.flaticon.com/128/443/443634.png"/>
                    </div>
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
                <Divider style={{
                    display: 'block',
                    margin: '0 0'
                }}/>
                <Flex gap="small" justify="flex-end" align="center">
                    <div style={{
                        width: "15%",
                        display:"flex",
                        justifyContent:"center"
                    }}>
                        <img style={{width:"75%"}} alt="" src="https://cdn-icons-png.flaticon.com/128/7154/7154465.png"/>
                    </div>
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
                <Divider style={{
                    display: 'block',
                    margin: '0 0'
                }}/>
                <Flex gap="small" justify="flex-end" align="center">
                    <div style={{
                        width: "15%",
                        display:"flex",
                        justifyContent:"center"
                    }}>
                        <img style={{width:"75%"}} alt="" src="https://cdn-icons-png.flaticon.com/128/6825/6825718.png"/>
                    </div>
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
