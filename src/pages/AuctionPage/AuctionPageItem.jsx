import React from 'react';
import { calculateTimeDifference } from '../../functions';
import { Card, Col, Flex, Space, Typography } from 'antd';
import "./auctionPage.css"

const getImageSource = (make, model) => {
    const imageName = `${make} ${model}.png`;
    return require(`../../assets/images/${imageName}`);
  };

export default function AuctionPageItem({ auction, isSelected, index, handleAuctionActionsShow }) {

    return (
        <Col className='auctionPageItem' span={24} style={{ height: '20%', width: '100%', display: 'flex' }} onClick={handleAuctionActionsShow} >
            <Card title={<Typography.Title className='carName'>{auction.make}&nbsp;{auction.model} </Typography.Title>} style={{ flex: 1, border: isSelected ? '2px solid #ff69b4' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                    <img
                        src={getImageSource(auction.make, auction.model)}
                        alt="Auction"
                        style={{ width: 'auto', height: '10vw', objectFit: "contain", marginRight: '10px' }}
                    />
                    <Space style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                        <Flex align="center">
                            <img src='https://static.thenounproject.com/png/1336726-200.png' className='hammer' alt=''/>
                            <Typography.Text className='subText'>
                                {calculateTimeDifference(auction.endTime)}
                            </Typography.Text>
                        </Flex>
                        <div style={{ display: 'flex', flexDirection: "column", alignItems: "flex-end" }}>
                            <Typography.Text className='subText'>
                                {auction.currentBid > auction.minBid ? 'CURRENT' : 'START'} BID
                            </Typography.Text>
                            <Typography.Text className='price' >
                                {auction.currentBid || auction.minBid}
                            </Typography.Text>
                        </div>
                        <div style={{ display: 'flex', flexDirection: "column", alignItems: "flex-end" }}>
                            <Typography.Text className='subText'>Buy out</Typography.Text>
                            <Typography.Text className='price'>{auction.buy}</Typography.Text>
                        </div>
                    </Space>
                </div>
            </Card>
        </Col>
    );
}
