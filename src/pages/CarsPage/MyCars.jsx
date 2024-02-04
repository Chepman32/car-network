import React, { useState, useEffect, useCallback } from "react";
import { Form, message, Typography } from "antd";
import { generateClient } from 'aws-amplify/api';
import { listCars as listCarsQuery } from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import "./carsPage.css";
import CarDetailsModal from "./CarDetailsModal";
import CarCard from "./CarCard";
import { fetchUserCarsRequest } from "../../functions";
import NewAuctionModal from "../AuctionPage/NewAuctionModal";

const client = generateClient();

const MyCars = ({ playerInfo, setMoney, money }) => {
  const [cars, setCars] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newAuctionvisible, setNewAuctionVisible] = useState(false);
  const [auctionDuration, setAuctionDuration] = useState(1);
  const [minBid, setMinBid] = useState(0);
  const [buy, setBuy] = useState(0)
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carDetailsVisible, setCarDetailsVisible] = useState(false);

  const [form] = Form.useForm();
  useEffect(() => {
    async function fetchUserCars() {
      setCars(await fetchUserCarsRequest(playerInfo.id))
    }
    fetchUserCars()
  }, [playerInfo.id]);

  const buyCar = async (car) => {
    if (playerInfo && playerInfo.id) {
      setMoney(money - car.price);
      try {
        setLoadingBuy(true);

        await client.graphql({
          query: mutations.updateUser,
          variables: {
            input: {
              id: playerInfo.id,
              money: money - car.price,
            },
          },
        });

        // Create a new user-car association
        await client.graphql({
          query: mutations.createUserCar,
          variables: {
            input: {
              userId: playerInfo.id,
              carId: car.id,
            },
          },
        });

        message.success('Car successfully bought!');
      } catch (err) {
        console.log(err);
        message.error('Error buying car');
      } finally {
        setLoadingBuy(false);
        setSelectedCar(null);
      }
    }
  };

  const createNewAuction = async () => {
      const auctionDurationSeconds = auctionDuration * 60 * 60;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const endTime = currentTimeInSeconds + auctionDurationSeconds;

      const newAuction = {
        make: selectedCar.make,
        model: selectedCar.model,
        year: selectedCar.year,
        type: selectedCar.type,
    currentBid: 0,
    endTime,
    status: 'Active',
    lastBidPlayer: '',
    player: playerInfo.nickname,
    buy,
    minBid,
      };
    try {
      const result = await client.graphql({
        query: mutations.createAuction,
        variables: {
          input: newAuction,
        },
      });
      const response = await client.graphql({
        query: mutations.deleteUserCar,
        variables: {
          input: {
            id: selectedCar.id,
          },
        },
      });
      
      
      const deletedCar = response.data.deleteUserCar;
  
      // Handle the response or perform any necessary actions
      console.log('Car deleted successfully:', deletedCar);
  
      cancelNewAuction()
      message.success('Auction created successfully!');
    } catch (error) {
      console.log('Error creating auction:', error);
    }
  };

  const showCarDetailsModal = () => {
    setCarDetailsVisible(true);
  };

  const cancelNewAuction = () => {
    setNewAuctionVisible(false);
  };

  const handleCarDetailsCancel = () => {
    setCarDetailsVisible(false);
  };

  const getImageSource = (make, model) => {
    const imageName = `${make} ${model}.png`;
    return require(`../../assets/images/${imageName}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 onClick={() => console.log(selectedCar)}>selected car</h2>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap" }}>
        {cars.length ? cars.map((car) => (
          <CarCard selectedCar={selectedCar} setSelectedCar={setSelectedCar} showCarDetailsModal={showCarDetailsModal} car={car.car} getImageSource={getImageSource}/>
        )) : <Typography.Title>You have no cars</Typography.Title>}
      </div>
      <CarDetailsModal
        visible={carDetailsVisible && selectedCar !== null}
        handleCancel={handleCarDetailsCancel}
        selectedCar={selectedCar}
        buyCar={buyCar}
        loadingBuy={loadingBuy}
        forAuction
        showNewAuction={() => {
          handleCarDetailsCancel()
          setNewAuctionVisible(true)
        }}
      />
      <NewAuctionModal
        visible={newAuctionvisible}
        handleCancel={cancelNewAuction}
        handleOk={createNewAuction}
        form={form}
        minBid={minBid}
        setMinBid={setMinBid}
        buy={buy}
        setBuy={setBuy}
        auctionDuration={auctionDuration}
        setAuctionDuration={setAuctionDuration}
        userCars={cars}
        setSelectedCar={setSelectedCar}
        selectedCar={selectedCar}
      />
    </div>
  );
};

export default MyCars;
