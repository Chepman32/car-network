/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      nickname
      money
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      nickname
      money
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      nickname
      money
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateAuction = /* GraphQL */ `
  subscription OnCreateAuction($filter: ModelSubscriptionAuctionFilterInput) {
    onCreateAuction(filter: $filter) {
      id
      carName
      player
      buy
      minBid
      currentBid
      endTime
      status
      lastBidPlayer
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateAuction = /* GraphQL */ `
  subscription OnUpdateAuction($filter: ModelSubscriptionAuctionFilterInput) {
    onUpdateAuction(filter: $filter) {
      id
      carName
      player
      buy
      minBid
      currentBid
      endTime
      status
      lastBidPlayer
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteAuction = /* GraphQL */ `
  subscription OnDeleteAuction($filter: ModelSubscriptionAuctionFilterInput) {
    onDeleteAuction(filter: $filter) {
      id
      carName
      player
      buy
      minBid
      currentBid
      endTime
      status
      lastBidPlayer
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateCar = /* GraphQL */ `
  subscription OnCreateCar($filter: ModelSubscriptionCarFilterInput) {
    onCreateCar(filter: $filter) {
      id
      make
      model
      year
      price
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateCar = /* GraphQL */ `
  subscription OnUpdateCar($filter: ModelSubscriptionCarFilterInput) {
    onUpdateCar(filter: $filter) {
      id
      make
      model
      year
      price
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteCar = /* GraphQL */ `
  subscription OnDeleteCar($filter: ModelSubscriptionCarFilterInput) {
    onDeleteCar(filter: $filter) {
      id
      make
      model
      year
      price
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
