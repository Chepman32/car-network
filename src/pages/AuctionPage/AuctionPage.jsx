import React, { useState, useEffect, useCallback } from "react";
import { Hub } from 'aws-amplify/utils';
import "@aws-amplify/ui-react/styles.css";
import { Modal, Form, Input, Button, Card, Col, Row, Typography, Flex, Select, message, Spin } from "antd";
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import { listAuctions as listAuctionsQuery } from '../../graphql/queries';
import { calculateTimeDifference } from "../../functions";
import AuctionPageItem from "./AuctionPageItem";
import { SelectedAuctionDetails } from "./SelectedAuctionDetails";
import AuctionActionsModal from "./AuctionActionsModal";

const { Option } = Select;
const client = generateClient();

export default function AuctionPage({ playerInfo, setMoney, money }) {
  const [auctions, setAuctions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [auctionDuration, setAuctionDuration] = useState(1);
  const [player, setPlayer] = useState("");
  const [loadingBid, setLoadingBid] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [form] = Form.useForm();
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [auctionActionsVisible, setAuctionActionsVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const listAuctions = useCallback(async () => {
    try {
      const auctionData = await client.graphql({ query: listAuctionsQuery });
      const auctions = auctionData.data.listAuctions.items.map(auction => {
        const endTime = new Date(parseInt(auction.endTime) * 1000);
        const timeLeft = calculateTimeDifference(endTime);

        return {
          ...auction,
          endTime,
          timeLeft
        };
      });

      setAuctions(auctions);
      auctions.length > 0 && !selectedAuction && setSelectedAuction(auctions[0]);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  }, []);

  async function createNewAuction() {
    try {
      const formData = form.getFieldsValue();
      const auctionDurationSeconds = auctionDuration * 60 * 60;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      const endTime = currentTimeInSeconds + auctionDurationSeconds;

      const newAuction = {
        carName: formData.carName,
        player: player,
        buy: formData.buy,
        minBid: formData.minBid,
        currentBid: formData.minBid,
        endTime: endTime,
        status: "active",
      };

      await client.graphql({
        query: mutations.createAuction,
        variables: { input: newAuction },
      });
      listAuctions();
      setVisible(false);
    } catch (error) {
      console.error('Error creating a new auction', error);
    }
  }

  const handleOk = () => {
    try {
      createNewAuction();
      setVisible(false);
    } catch (error) {
      console.error('Error creating auction', error);
    }
  };

  const increaseBid = async (auction) => {
    try {
      setLoadingBid(true);
      const increasedBidValue = Math.floor(auction.currentBid * 1.1) || Math.round(auction.minBid * 1.1)
      setMoney(auction.lastBidPlayer === playerInfo.nickname ? money - (increasedBidValue - auction.currentBid) : money - increasedBidValue)
      const updatedAuction = {
        id: auction.id,
        carName: auction.carName,
        player: auction.player,
        buy: auction.buy,
        minBid: auction.minBid,
        currentBid: increasedBidValue,
        endTime: auction.endTime,
        lastBidPlayer: playerInfo.nickname,
        status: increasedBidValue < auction.buy ? "active" : "finished",
      };
      await client.graphql({
        query: mutations.updateAuction,
        variables: { input: updatedAuction },
      });
      await client.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: playerInfo.id,
            money: auction.lastBidPlayer === playerInfo.nickname ? money - (increasedBidValue - auction.currentBid) : money - increasedBidValue
          }
        },
      });
      handleCancel()
      message.success('Bid successfully increased!');

      listAuctions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBid(false);
    }
  };

  const buyItem = async (auction) => {
    try {
      setLoadingBuy(true);
      const increasedBidValue = Math.round(auction.currentBid * 1.1) || Math.round(auction.minBid * 1.1);

      const updatedAuction = {
        id: auction.id,
        carName: auction.carName,
        player: auction.player,
        buy: 300,
        minBid: 300,
        currentBid: 300,
        endTime: auction.endTime,
        lastBidPlayer: playerInfo.nickname,
        status: "finished",
      };

      setMoney(auction.lastBidPlayer === playerInfo.nickname ? money - (auction.buy - auction.currentBid) : money - auction.buy);

      await client.graphql({
        query: mutations.updateAuction,
        variables: { input: updatedAuction },
      });
      await client.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: playerInfo.id,
            money: auction.lastBidPlayer === playerInfo.nickname ? money - (auction.buy - auction.currentBid) : money - increasedBidValue
          }
        },
      });
      message.success('Car successfully bought!');
      listAuctions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBuy(false);
    }
  };

  const listener = async (data) => {
    const { nickname } = data?.payload?.data;
    setPlayer(nickname);
  };

  useEffect(() => {
    listAuctions();
    Hub.listen('auth', listener);
  }, [listAuctions]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      setSelectedAuction((prevAuction) => {
        const newIndex = auctions.indexOf(prevAuction) - 1;
        return newIndex >= 0 ? auctions[newIndex] : prevAuction;
      });
    } else if (e.key === "ArrowDown") {
      setSelectedAuction((prevAuction) => {
        const newIndex = auctions.indexOf(prevAuction) + 1;
        return newIndex < auctions.length ? auctions[newIndex] : prevAuction;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [auctions, selectedAuction]);

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        <Typography.Title level={1} style={{ textAlign: 'center' }}>Virtual Car Auction</Typography.Title>
        <Flex justify="center">
          <Button onClick={showModal}>Start auction</Button>
        </Flex>
        <div className="auction-items-container" style={{ flex: 1 }}>
          {auctions.map((auction) => (
            <AuctionPageItem
              key={auction.id}
              auction={auction}
              increaseBid={increaseBid}
              buyItem={buyItem}
              isSelected={auction === selectedAuction}
              setAuctionActionsVisible={setAuctionActionsVisible}
            />
          ))}
        </div>
      </div>
      <SelectedAuctionDetails selectedAuction={selectedAuction} />
      <Modal
        visible={visible}
        title="Create a New Auction"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="carName" label="Car Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="minBid" label="Minimal bid" rules={[{ required: true }]}>
            <Input type="number" defaultValue={0} />
          </Form.Item>
          <Form.Item name="buy" label="Buy" rules={[{ required: true }]}>
            <Input type="number" defaultValue={0} />
          </Form.Item>
          <Form.Item name="auctionDuration" label="Auction Duration (hours)" rules={[{ required: true }]}>
            <Select value={auctionDuration} onChange={(value) => setAuctionDuration(value)}>
              <Option value={1}>1 hour</Option>
              <Option value={3}>3 hours</Option>
              <Option value={6}>6 hours</Option>
              <Option value={12}>12 hours</Option>
              <Option value={24}>24 hours</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
