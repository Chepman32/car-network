import { generateClient } from "aws-amplify/api";
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'

const client = generateClient();

export const fetchUserCarsRequest = async (id) => {
  try {
    const userData = await client.graphql({
      query: `
        query GetUser($id: ID!) {
          getUser(id: $id) {
            cars {
              items {
                car {
                  id
                  make
                  model
                  year
                  type
                  price
                }
              }
            }
          }
        }
      `,
      variables: {
        id
      },
    });
    return userData.data.getUser.cars.items
  } catch (error) {
    console.error("Error fetching user's cars:", error);
  }
}

export const getCarTypeColor = (carType) => {
  switch (carType) {
    case "regular":
      return "#32a852"
    case "rare":
      return "#397aab"
      case "legendary":
      return "#d4ca0f"
      case "epic":
      return "#4d1ac4"
    default:
      return "#32a852"
  }
}
  
export function calculateTimeDifference(targetTime) {
  const targetDateTime = new Date(targetTime);
  const currentTime = new Date();
  const timeDifferenceInSeconds = Math.floor((targetDateTime - currentTime) / 1000);

  if (timeDifferenceInSeconds <= 0) {
    return "Finished";
  } else if (timeDifferenceInSeconds < 60) {
    return "finishing";
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    const remainingMinutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
}

export const createNewUserCar = async (userId, carId) => {
  await client.graphql({
    query: mutations.createUserCar,
    variables: {
      input: {
        userId,
        carId,
      },
    },
  });
}

export async function getUserCar(userId, carId) {
  const userCarData = await client.graphql({
    query: queries.listUserCars,
    variables: {
      filter: {
        userId: { eq: userId },
        carId: { eq: carId }
      }
    },
  });

  const toBeDeletedUserCar = userCarData.data.listUserCars.items[0]; // This should now contain the UserCar data

  return toBeDeletedUserCar;
}

export async function deleteUserCar(userCar) {
  const deletedData = await client.graphql({
    query: mutations.deleteUserCar, // Replace with your actual delete mutation
    variables: { input: { id: userCar.id } }, // Pass 'id' inside an 'input' object
  });

  return deletedData;
}

export const createNewAuctionUser = async (userId, auctionId) => {
  try {
    const result = await client.graphql({
      query: mutations.createAuctionUser,
      variables: {
        input: {
          userId,
          auctionId,
        },
      },
    });
    return result.data.createAuctionUser; // Return the created auction user data
  } catch (error) {
    console.error('Error creating auction user:', error);
    throw error; // Handle or propagate the error as needed
  }
};

export const fetchAuctionUser = async (auctionId) => {
  try {
    const auctionUserData = await client.graphql({
      query: queries.listAuctionUsers,
      variables: {
        filter: {
          auctionId: { eq: auctionId }
        }
      }
    });

    const auctionUser = auctionUserData.data.listAuctionUsers.items[0];

    if (!auctionUser) {
      // Auction user not found
      return null;
    }

    const userData = await client.graphql({
      query: queries.getUser,
      variables: {
        id: auctionUser.userId  
      }
    });

    const user = userData.data.getUser;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const increaseAuctionUserMoney = async (auctionUserId) => {

  try {

    // Get current user money
    const userResult = await client.graphql({
      query: queries.getUser,  
      variables: {
        id: auctionUserId
      }
    });
    
    const currentMoney = userResult.data.getUser.money;

    // Calculate new money
    const newMoney = currentMoney + 2000;

    // Update user with new money
    await client.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: auctionUserId,
          money: newMoney
        }
      }
    });

    console.log("Increased auction user money by 2000!");

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserCreatedAuction(auctionId) {
  try {
    const auctionUserData = await client.graphql({
      query: queries.getAuctionUser,
      variables: {
        id: auctionId
      }
    });

    const auctionUser = auctionUserData.data.getAuctionUser;

    if (!auctionUser) {
      // Auction user not found
      return null;
    }

    return auctionUser.userId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const addUserToAuction = async (userId, auctionId) => {
  try {
    await client.graphql({
      query: mutations.createAuctionUser,
      variables: {
        input: {
          userId: userId,
          auctionId: auctionId
        }
      }
    });
  } catch (error) {
    console.error('Error adding user to auction:', error);
    // Handle error or notify the user
  }
};
