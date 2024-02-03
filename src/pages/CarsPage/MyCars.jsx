import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Input, message, Select, Typography } from "antd";
import { generateClient } from 'aws-amplify/api';
import { listCars as listCarsQuery } from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import "./carsPage.css";
import CarDetailsModal from "./CarDetailsModal";
import CarCard from "./CarCard";
import { fetchUserCarsRequest } from "../../functions";
import NewAuctionModal from "../AuctionPage/NewAuctionModal";

const { Option } = Select;
const client = generateClient();

const MyCars = ({ playerInfo, setMoney, money }) => {
  const [cars, setCars] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newAuctionvisible, setNewAuctionVisible] = useState(false);
  const [auctionDuration, setAuctionDuration] = useState(1);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [carDetailsVisible, setCarDetailsVisible] = useState(false);

  const [form] = Form.useForm();

  const fetchCars = useCallback(async () => {
    try {
      const carData = await client.graphql({ query: listCarsQuery });
      setCars(carData.data.listCars.items);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }, []);

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

  async function createNewAuction() {
    try {
      const formData = form.getFieldsValue();
      const auctionDurationSeconds = auctionDuration * 60 * 60;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      const endTime = currentTimeInSeconds + auctionDurationSeconds;

      const newAuction = {
        carName: formData.carName,
        player: playerInfo.nickname,
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
      setNewAuctionVisible(false);
    } catch (error) {
      console.error('Error creating a new auction', error);
    }
  }

  const showModal = () => {
    setVisible(true);
  };

  const showCarDetailsModal = () => {
    setCarDetailsVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
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
