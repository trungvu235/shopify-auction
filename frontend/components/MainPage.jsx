import {Button, Flex, theme, Divider} from "antd";
import {RightOutlined} from "@ant-design/icons";

export default function MainPage({page, setPage}) {

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const navigateToRewardList = () => {
        setPage('reward-list');
    }

    const navigateToEarnPoint = () => {
        setPage('earn-point');
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
                        <img style={{width:"80%"}} alt="" src="https://cdn-icons-png.flaticon.com/128/1052/1052364.png"/>
                    </div>
                    <div style={{
                        width: "75%"
                    }}>
                        <p style={{fontWeight: "bold", fontSize: "15px", textAlign: "center", display: 'flex'}}>
                            Let's go see the auctions
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
                        <img style={{width:"75%"}} alt="" src="https://cdn-icons-png.flaticon.com/128/1052/1052364.png"/>
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
                        <Button type="text" icon={<RightOutlined/>} onClick={navigateToEarnPoint}
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
                            Upcoming list
                        </p>
                    </div>
                    <div style={{
                        width: "10%"
                    }}>
                        <Button type="text" icon={<RightOutlined/>} onClick={navigateToRewardList}
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
