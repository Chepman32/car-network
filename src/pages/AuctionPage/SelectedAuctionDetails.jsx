import React from "react";
import { Card, Space, Typography, Col, Flex } from "antd";

const getImageSource = (make, model) => {
  const imageName = `${make} ${model}.png`;
  return require(`../../assets/images/${imageName}`);
};

export const SelectedAuctionDetails = ({ selectedAuction }) => {
  return (
    <Col className="auctionDetails" span={12} style={{ height: '100%', padding: '20px' }}>
      {selectedAuction && (
        <Flex direction="column" style={{ height: "100%" }}>
          <Card
            title={<h3>{`${selectedAuction.make.toUpperCase()} ${selectedAuction.model}`} </h3>}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Space direction="vertical" style={{ flex: 1 }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <img
                  src={getImageSource(selectedAuction.make, selectedAuction.model)}
                  alt="Auction"
                  className="auctionDetails_image"
                />
              </div>
              <Flex direction="column" justify="space-between" align="center" style={{ flex: 1 }}>
              <Typography.Text className="subText">
                    {`${selectedAuction?.currentBid ? "Current" : "Start"} Bid: `}
                  </Typography.Text>
                  <Typography.Text className="price bid">
                    &nbsp;{selectedAuction?.currentBid || selectedAuction.minBid}
                  </Typography.Text>
              </Flex>
              <Flex direction="column" justify="space-between" align="center" style={{ flex: 1 }}>
              <Typography.Text className="subText">
                    {`Buy out:`}
                  </Typography.Text>
                  <Typography.Text className="price buy">
                    {`${selectedAuction.buy}`}
                  </Typography.Text>
              </Flex>
            </Space>
          </Card>
        </Flex>
      )}
    </Col>
  );
};
