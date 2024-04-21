import { useState, useEffect, useCallback, Fragment } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for keyboard behavior and offset
const keyboardBehavior = Platform.OS === 'android' ? 'padding' : 'height';
const keyboardVerticalOffset = Platform.OS === 'android' ? 80 : 0;

const Chat = ({ route, navigation, db, isConnected }) => {
  const [messages, setMessages] = useState([]);
  const { name } = route.params;

  useEffect(() => {
    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, orderBy("createdAt", "desc"));

    const unsubscribe = isConnected ? onSnapshot(q, (querySnapshot) => {
      const messagesFirestore = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: new Date(doc.data().createdAt.seconds * 1000),
        user: doc.data().user
      })).reverse();
      setMessages(messagesFirestore);
      AsyncStorage.setItem('messages', JSON.stringify(messagesFirestore));
    }) : () => {};

    if (!isConnected) {
      AsyncStorage.getItem('messages').then(storedMessages => {
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      });
    }

    return () => unsubscribe();
  }, [db, isConnected]);

  const onSend = useCallback((newMessages = []) => {
    if (isConnected) {
      const { _id, createdAt, text, user } = newMessages[0];
      addDoc(collection(db, "messages"), {
        _id,
        createdAt,
        text,
        user
      });
    }
  }, [db, isConnected]);

  const renderBubble = useCallback((props) => (
    <Bubble {...props} wrapperStyle={{
      right: { backgroundColor: "#000" },
      left: { backgroundColor: "#FFF" }
    }} />
  ), []);

  const renderInputToolbar = (props) => isConnected ? <InputToolbar {...props} /> : null;

  return (
    <Fragment>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={styles.container}>
          <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            onSend={messages => onSend(messages)}
            user={{ _id: route.params.uid, name }}
            renderInputToolbar={renderInputToolbar}
          />
        </View>
      </KeyboardAvoidingView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;


