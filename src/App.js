import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import AuctionPage from "./pages/AuctionPage/AuctionPage";
import CustomHeader from "./components/CustomHeader";  
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import { Hub } from "aws-amplify/utils";
import { generateClient } from "aws-amplify/api";
import { listUsers } from "./graphql/queries";
import { createUser } from "./graphql/mutations";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import CarsStore from "./pages/CarPages/CarsStore";
import MyCars from "./pages/CarPages/MyCars";
import { Spin, message } from "antd";
import { getCurrentUser } from "aws-amplify/auth";

const client = generateClient(); 
Amplify.configure(awsExports);

export default function App() {
  const [nickname, setNickname] = useState();
  const [money, setMoney] = useState();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      const playersData = await client.graphql({
        query: listUsers,
      });
      const playersList = playersData.data.listUsers.items;
      const user = playersList.find((u) => u.nickname === username);
      setPlayerInfo(user);
      setMoney(user.money)
    } catch (err) {
      console.log(err);
    }
  }
  

  useEffect(() => {
    currentAuthenticatedUser()
  }, [])

  async function createNewPlayer(username) {
    setCreatingUser(true);
    const data = {  
      nickname: username,
      money: 1000,
    };
    await client.graphql({
      query: createUser,
      variables: { input: data }
    });
    setCreatingUser(false);
    setPlayerInfo(data)
    message.success("User successfully created");
  }

  const listener = (data) => {
    if (data.payload.event === "signedIn") {
      setNickname(data?.payload?.data?.username);
      createNewPlayer(data?.payload?.data?.username);
    }
  };

  Hub.listen("auth", listener)

  return (
    <BrowserRouter>
      {!creatingUser && ( 
        <Authenticator>
          {({ signOut, user }) => (  
            <>
              {nickname !== null && (
                <main >
                  {playerInfo && (
                    <CustomHeader  
                      money={playerInfo.money}
                      username={playerInfo.nickname}
                    />
                  )}

                  <h2>{money} </h2>
                  
                  {
                    playerInfo
                      ?
                      <Routes>
                    <Route 
                      path="/carsStore"  
                      element={
                        <CarsStore
                          playerInfo={playerInfo}
                          money={money}
                          setMoney={setMoney}  
                        />
                      }
                    />

                    <Route
                      path="/auctions"
                      element={
                        <AuctionPage
                          playerInfo={playerInfo}
                          money={money} 
                          setMoney={setMoney}
                        />
                        
                      }  
                        />
                        <Route
                      path="/myCars"
                      element={
                        <MyCars
                          playerInfo={playerInfo}
                          money={money} 
                          setMoney={setMoney}
                        />
                        
                      }  
                        />
                        <Route
                      path="/auctions"
                      element={
                        <AuctionPage
                          playerInfo={playerInfo}
                          money={money} 
                          setMoney={setMoney}
                        />
                      }  
                        />
                      </Routes>
                      :
                      <Spin fullscreen/>
                  }

                </main>
              )}

              <button onClick={signOut}>Sign out</button>   
            </>
          )}
        </Authenticator>
      )}

      {creatingUser && <Spin />}

    </BrowserRouter>
  );

}