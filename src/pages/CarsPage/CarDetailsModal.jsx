import React from "react";
import { Modal, Spin } from "antd";
import "./carsPage.css";

const CarDetailsModal = ({ visible, handleCancel, selectedCar, buyCar, loadingBuy }) => {
  const rowStyle = {
    height: '10vh', // Set height to 10% of the viewport height
    backgroundColor: 'green', // Set green background color
    marginBottom: '1px', // Add margin between rows
  };

  return (
      <Modal
          centered
          className="carDetailsModal"
          width={window.innerWidth * 0.5}
      visible={visible}
      title="Car Details"
      onCancel={handleCancel}
      footer={null}
    >
      {/* Add your content for the new modal here */}
          <div className="carDetailsModal__row" onClick={() => {
              buyCar(selectedCar)
      }} >{loadingBuy ? <Spin/> : "Buy"} </div>
      <div className="carDetailsModal__row">Add to favorites</div>
      <div className="carDetailsModal__row">Row 3</div>
      <div className="carDetailsModal__row">Row 4</div>
      <div className="carDetailsModal__row">Row 5</div>
    </Modal>
  );
};

export default CarDetailsModal;
