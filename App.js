import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox, Alert } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import Start from './components/Start';
import Chat from './components/Chat';
import { db } from './components/firebaseConfig';
import { disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import app from './components/firebaseConfig';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createNativeStackNavigator();

const App = () => {
  const netInfo = useNetInfo();
  const [lastConnectedStatus, setLastConnectedStatus] = useState(netInfo.isConnected);
  const storage = getStorage(app);

  useEffect(() => {
    const handleNetworkChange = async () => {
      // Only trigger network changes if the status is different and stable for at least 1 second
      if (lastConnectedStatus !== netInfo.isConnected) {
        setTimeout(async () => {
          if (netInfo.isConnected) {
            await enableNetwork(db);
            console.log("Network enabled!");
          } else {
            await disableNetwork(db);
            console.log("Network disabled!");
            Alert.alert("Connection Lost", "You are now offline. Some features may not be available.");
          }
          setLastConnectedStatus(netInfo.isConnected);
        }, 1000); // Debounce time of 1 second
      }
    };

    handleNetworkChange();
  }, [netInfo.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
        <Stack.Screen
          name="Chat"
          options={({ route }) => ({
            title: route.params.name,
            headerStyle: { backgroundColor: route.params.backgroundColor },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          })}
        >
          {props => <Chat {...props} db={db} storage={storage} isConnected={netInfo.isConnected} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

