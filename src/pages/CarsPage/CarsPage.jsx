import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Modal, Form, Input, message, Spin, Select } from "antd";
import { generateClient } from 'aws-amplify/api';
import { listCars as listCarsQuery, getUserCars, getUser } from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import "./carsPage.css";
import CarDetailsModal from "./CarDetailsModal";
import CarCard from "./CarCard";

const { Option } = Select;
const client = generateClient();

const CarsPage = ({ playerInfo, setMoney, money }) => {
  const [cars, setCars] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [form] = Form.useForm();
  const [carDetailsVisible, setCarDetailsVisible] = useState(false);

  const fetchCars = useCallback(async () => {
    try {
      const carData = await client.graphql({ query: listCarsQuery });
      setCars(carData.data.listCars.items);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }, []);

  const fetchUserCars = useCallback(async () => {
    try {
      const userData = await client.graphql({
        query: `
          query GetUser($id: ID!) {
            getUser(id: $id) {
              cars {
                items {
                  id
                }
              }
            }
          }
        `,
        variables: {
          id: playerInfo.id,
        },
      });
  
      setCars(userData.data.getUser.Cars.items);
    } catch (error) {
      console.error("Error fetching user's cars:", error);
    }
  }, []);
  
  
  
  
  
  

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

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
              carId: car.id, // Assuming the car object has an 'id' property
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

  const showModal = () => {
    setVisible(true);
  };

  const showCarDetailsModal = () => {
    setCarDetailsVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCarDetailsCancel = () => {
    setCarDetailsVisible(false);
  };

  const createNewCar = async (values) => {
    const newCar = {
      make: values.make,
      model: values.model,
      year: parseInt(values.year),
      price: parseInt(values.price),
      type: values.type,
    };
    await client.graphql({
      query: mutations.createCar,
      variables: { input: newCar },
    });
    await fetchCars();
    setVisible(false);
    form.resetFields();
    message.success('Car created successfully!');
  };
  
  const getImageSource = (make, model) => {
    const imageName = `${make} ${model}.png`;
    return require(`../../assets/images/${imageName}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={fetchUserCars} style={{ marginBottom: '20px' }}>
        Create New Car
      </Button>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap" }}>
        {cars.map((car) => (
          <CarCard selectedCar={selectedCar} setSelectedCar={setSelectedCar} showCarDetailsModal={showCarDetailsModal} car={car} getImageSource={getImageSource}/>
        ))}
      </div>

      <Modal
        visible={visible}
        title="Create a New Car"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              createNewCar(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={(values) => createNewCar(values)}
        >
          <Form.Item name="make" label="Make" rules={[{ required: true, message: 'Please enter the make!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="model" label="Model" rules={[{ required: true, message: 'Please enter the model!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="year" label="Year" rules={[{ required: true, message: 'Please enter the year!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select the type!' }]}>
            <Select>
              <Option value="regular">Regular</Option>
              <Option value="epic">Epic</Option>
              <Option value="legendary">Legendary</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <CarDetailsModal
        visible={carDetailsVisible && selectedCar !== null}
        handleCancel={handleCarDetailsCancel}
        selectedCar={selectedCar}
        buyCar={buyCar}
        loadingBuy={loadingBuy}
      />
    </div>
  );
};

export default CarsPage;
