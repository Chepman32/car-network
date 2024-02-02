import { generateClient } from "aws-amplify/api";

const client = generateClient();
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