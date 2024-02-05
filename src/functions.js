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

export async function getUserCar(userId, carId) {
  const userCarData = await client.graphql({
    query: queries.listUserCars, // Replace with your actual list query
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
