import "./auctionPage.css"
const { Card, Space, Typography, Col, Flex } = require("antd");

const getImageSource = (carName) => {
    const imageName = `${carName}.png`;
    return require(`../../assets/images/${imageName}`);
};

export const SelectedAuctionDetails = ({ selectedAuction }) => {

  return (
      <Col className="auctionDetails" span={12} style={{ height: '100%', padding: '20px' }}>
          {selectedAuction && (
              <Col span={12} style={{ height: "100% !important", padding: '20px' }}>
              {selectedAuction && (
                      <Card
                          title={<h3>{`${selectedAuction.carName.toUpperCase()}`} </h3>}
                          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                      >
                          <Space direction="vertical" style={{ flex: 1 }}>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                          <img
                              src={getImageSource(selectedAuction.carName)}
                              alt="Auction"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                      </div>
                          <Flex justify="space-between" align="center">
                              <Typography.Text className="subText" >
                                  {`Current Bid`}
                                  </Typography.Text>
                                  <Typography.Text className="price bid" >
                                  {selectedAuction.currentBid}
                              </Typography.Text>
                              </Flex>
                              <Flex justify="space-between" align="center">
                              <Typography.Text className="subText" >
                                  {`Buy out:`}
                                  </Typography.Text>
                                  <Typography.Text className="price buy" >
                                  {`${selectedAuction.buy}`}
                              </Typography.Text>
                              </Flex>
                      </Space>
                  </Card>
              )}
          </Col>
          
          )}
      </Col>
  );
};
