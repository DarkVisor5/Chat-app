import React, { useEffect } from 'react';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';
import { useNetInfo } from "@react-native-community/netinfo";
import { LogBox } from 'react-native';
import { Alert } from 'react-native';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCujNY5mZH7neIrTaKS5lzNKwrfqg9y_4M",
    authDomain: "chatapp-ef8f8.firebaseapp.com",
    projectId: "chatapp-ef8f8",
    storageBucket: "chatapp-ef8f8.appspot.com",
    messagingSenderId: "599937948595",
    appId: "1:599937948595:web:32651c8e81380899eb89c6"
  };

  let app, db;

  // Initialize Firebase only if no apps have been initialized yet
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    const auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } else {
    app = getApps()[0];
    db = getFirestore(app);
  }

  const netInfo = useNetInfo();

  // Functions to enable/disable the network
  async function disableFirestoreNetwork() {
    await disableNetwork(db);
    console.log("Network disabled!");
  }

  async function enableFirestoreNetwork() {
    await enableNetwork(db);
    console.log("Network enabled!");
  }

  useEffect(() => {
    const toggleNetwork = async () => {
      try {
        if (netInfo.isConnected) {
          await enableFirestoreNetwork();
          console.log('Network enabled');
        } else {
          await disableFirestoreNetwork();
          console.log('Network disabled');
          Alert.alert("Connection Lost", "You are now offline. Some features may not be available.");
        }
      } catch (error) {
        console.error('Failed to toggle network', error);
      }
    };

    toggleNetwork();
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
          {props => <Chat {...props} db={db} isConnected={netInfo.isConnected} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
