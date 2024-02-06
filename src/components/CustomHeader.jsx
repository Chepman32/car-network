import React from 'react';
import { Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const CustomHeader = ({ username, money }) => {
  return (
    <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Menu.Item key="carsStore">
          <Link to="/carsStore">Cars Store</Link>
        </Menu.Item>
        <Menu.Item key="myCars">
          <Link to="/myCars">My Cars</Link>
        </Menu.Item>
        <Menu.Item key="auctionsHub">
          <Link to="/auctionsHub">Auctions</Link>
        </Menu.Item>
      </div>
      <Menu.Item key="user">
        <Text style={{color: "#fff"}} >{username}</Text>
        <Text style={{ marginLeft: 15 }} type="warning">{`$${money}`}</Text>
      </Menu.Item>
    </Menu>
  );
};

export default CustomHeader;
