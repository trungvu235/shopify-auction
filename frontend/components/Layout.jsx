import {Button, Flex, Layout, Space, theme, Menu} from "antd";
export default function LayoutPage({customer, childComponent, shop, page, setPage,}) {
    const {Header, Content, Footer} = Layout;
    const modal = document.getElementById("major-popup-parent");
    const overlay = document.getElementById("overlay");
    const PopupClose = function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    }

    const items = [
        {
            key: 'main-page',
            label: 'Home',
        },
        {
            key: 'upcoming-list',
            label: 'Upcoming Auctions',
        },
        {
            key: 'active-list',
            label: 'Running auctions',
        },
        {
            key: 'auctions-list',
            label: 'Check your bids',
        },
    ];
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <Layout style={{position: "relative", height: '100%'}}>
            {customer ? (
                <Header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    width: '100%',
                    display: 'block',
                    alignItems: 'center',
                    padding: '0 10px',
                    minHeight:'120px'
                }}>
                    <div style={{position: 'absolute', top: 10, right: 10, zIndex: 10, display: 'flex'}}>
                        <Button ghost size="small" shape="circle" display="flex"
                                onClick={PopupClose}>&#x00d7;</Button>
                    </div>
                    <div style={{width:'100%', display: 'flex', justifyContent:'center', textAlign:'center'}}>
                        <p style={{
                            color: '#ffffff',
                            lineHeight: '21px',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                            width: "200px",
                            overflow: 'hidden'
                        }}>
                            Welcome to {shop.name}!
                        </p>
                    </div>
                    <div>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['main-page']}
                            selectedKeys={[page.toString()]}
                            onSelect={(info) => setPage(info.key)}
                            items={items}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                justifyContent:'center'
                            }}
                        />
                    </div>
                </Header>
            ) : (
                <Header style={{
                    position: 'sticky',
                    top: 0,
                    height: 100,
                    zIndex: 10,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px'
                }}>
                    <div style={{position: 'absolute', top: 10, right: 10, zIndex: 10, display: 'flex'}}>
                        <Button ghost size="small" shape="circle" display="flex"
                                onClick={PopupClose}>&#x00d7;</Button>
                    </div>
                    <Space direction="vertical" size="small" style={{display: "flex"}} align="baseline">
                        <h3 style={{color: '#ffffff', lineHeight: '0px'}}>
                            Welcome to
                        </h3>
                        <h2 style={{
                            color: '#ffffff',
                            lineHeight: '17px',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                            width: "250px",
                            overflow: 'hidden'
                        }}>
                            {shop.name}
                        </h2>
                    </Space>
                </Header>
            )}
            <Content style={{padding: '10px'}}>
                {customer ? (
                    <div style={{minHeight: 540}}>
                        {childComponent}
                    </div>
                ) : (
                    <div style={{minHeight: 540}}>
                        {childComponent}
                    </div>
                )}
            </Content>
            <Footer style={{ textAlign: 'center', background: colorBgContainer, borderRadius: borderRadiusLG }}>
                    Shopify Auction App ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    )
}
