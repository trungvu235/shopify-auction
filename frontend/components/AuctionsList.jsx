import {Button, Flex, Layout, Space, theme, Avatar, List, Tag} from "antd";
import React, {useEffect, useState} from "react";
import LoginPage from "~/components/LoginPage";
import {testFetch} from "@/utils/apis";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export default function AllAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [displayAuctions, setDisplayAuctions] = useState([]);
    useEffect(() => {
        testFetch().then(response => {
            if (response) {
                setAuctions(response.response.data.getAuctions);
            }
        });
    }, []);

    useEffect(() => {
        if (auctions) {
            console.log(auctions);
            setDisplayAuctions(auctions.slice().reverse());
        }
    }, [auctions]);

    return (
        <div>
            {displayAuctions ? (
                <div>
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        dataSource={displayAuctions}
                        renderItem={(item) => (
                            <List.Item
                                key={item.key}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar src={item.auction_thumbnail ?
                                            item.auction_thumbnail :
                                            'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'} />
                                    }
                                    title={
                                        <div>
                                            <a style={{fontFamily: "Archivo, serif", display:"block"}} href="https://ant.design">
                                                {item.name}
                                            </a>
                                            {new Date(item.start_date) > Date.now() && (
                                                <Tag color="green" >Scheduled</Tag>
                                            )}
                                            {new Date(item.start_date) < Date.now() && new Date(item.end_date) > Date.now() && (
                                                <Tag color="blue" >Active</Tag>
                                            )}
                                            {new Date(item.end_date) < Date.now() && (
                                                <Tag color="gold" >Completed</Tag>
                                            )}
                                        </div>
                                    }
                                    description={item.end_price ? `Current bid: $${item.end_price}`
                                        : `No bids on this auction yet.`}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            ) : (
                <div>test 3</div>
            )}
        </div>
    )
}
