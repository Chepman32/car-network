// CustomHeader.js
import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const CustomHeader = (username, money) => {
  return (
    <Menu theme="dark" mode="horizontal">
      <Menu.Item key="carsStore">
        <Link to="/carsStore">Cars Store</Link>
      </Menu.Item>
      <Menu.Item key="cars">
        <Link to="/myCars">My Cars</Link>
      </Menu.Item>
      <Menu.Item key="auctionsHub">
        <Link to="/auctionsHub">Auctions</Link>
      </Menu.Item>
    </Menu>
  );
};

export default CustomHeader;
