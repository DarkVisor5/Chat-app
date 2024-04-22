import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { db } from './firebaseConfig';

const Chat = ({ route, storage, isConnected }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, orderBy("createdAt", "desc"));
    const unsubscribe = isConnected ? onSnapshot(q, (querySnapshot) => {
      const messagesFirestore = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const firebaseData = {
          _id: doc.id,
          text: data.text || '',
          createdAt: data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000) : data.createdAt,
          user: data.user || {},
          image: data.image || '',
          location: data.location || null,
        };
        return firebaseData;
      }).reverse();
      setMessages(messagesFirestore);
      AsyncStorage.setItem('messages', JSON.stringify(messagesFirestore));
    }) : () => {};

    return () => unsubscribe();
  }, [isConnected]);

  // Function to create an image message
  const createImageMessage = (id, user, uri) => {
    return {
      _id: id,
      createdAt: new Date(),
      user: user,
      image: uri,
      type: 'image'  // Ensure type or other required properties are handled if needed
    };
  };
  
  // Function to create a location message
  const createLocationMessage = (id, user, location) => {
    return {
      _id: id,
      createdAt: new Date(),
      user: user,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      text: '', // Often location messages might not have text, but ensure this is handled if your UI expects it
      type: 'location'
    };
  };
  
  const onSend = useCallback(async (messagesToSend = []) => {
    for (const message of messagesToSend) {
      const { _id, text, createdAt, user, image, location } = message;
      try {
        const messageToStore = {
          text: text || '',
          createdAt: new Date(), // Firestore expects timestamps
          user: user,
          image: image || '', // Include image URL if available
          location: location || null // Include location data if available
        };
        await addDoc(collection(db, "messages"), messageToStore);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }, []);

  

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage && currentMessage.location) {
      return (
        <MapView
          style={{ width: 200, height: 100 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        />
      );
    }
    return null;
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { backgroundColor: "#000" },
        left: { backgroundColor: "#FFF" }
      }}
    />
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "android" ? "padding" : "height"} keyboardVerticalOffset={80}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.uid,
          name: route.params.name,
        }}
        renderActions={(props) => (
          <CustomActions
            {...props}
            onSend={onSend}
            storage={storage}
            userID={route.params.uid}
            createImageMessage={createImageMessage}
            createLocationMessage={createLocationMessage}
          />
        )}
        renderBubble={renderBubble}
        renderInputToolbar={(props) => isConnected ? <InputToolbar {...props} /> : null}
        renderCustomView={renderCustomView}
      />
    </KeyboardAvoidingView>
  );
};

export default Chat;





