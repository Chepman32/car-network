import React, { useState, useEffect, useCallback } from "react";
import "@aws-amplify/ui-react/styles.css";
import { List, Form, Input, Button, Card, Col, Row, Typography, Flex, Select, message, Spin, Space } from "antd";
import { Link } from "react-router-dom";

export default function AuctionsHub() {

  return (
      <div className="auctionsHub">
          <Row style={{ height: '85vh', margin: '0', padding: '20px', boxSizing: 'border-box' }}>
      <Col span={12} style={{ height: '100%' }}>
                  <Link to="/auctions">
                  <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Find auctions
        </Card>
      </Link>
      </Col>
      <Col span={12} style={{ height: '100%' }}>
                  <Link to="/myCars">
                  <Row style={{ height: '50%' }}>
          <Card style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Start auction
          </Card>
        </Row>
      </Link>
                  <Link to="/myBids">
                  <Row style={{ height: '25%' }}>
          <Card style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            My bids
          </Card>
        </Row>
      </Link>
                  <Link to="/myAuctions">
                  <Row style={{ height: '25%' }}>
          <Card style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            My auctions
          </Card>
        </Row>
      </Link>
        <Row style={{ height: '10%' }}>
          <Card style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Auction notifications
          </Card>
        </Row>
      </Col>
    </Row>
    </div>
  );
}
