import { Form, Input, Modal, Select } from 'antd';
import React from 'react';

const { Option } = Select;

export default function NewAuctionModal({ visible, handleCancel, handleOk, selectedCar, setSelectedCar, setAuctionDuration, auctionDuration }) {
  const [form] = Form.useForm();

  return (
    <Modal
          visible={visible}
          centered
      title="Create a New Auction"
      okText="Create"
      cancelText="Cancel"
      onCancel={handleCancel}  // Ensure that onCancel is assigned to handleCancel
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
  );
}
