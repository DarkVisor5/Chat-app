import { useState, useEffect, useCallback, Fragment } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
  const [messages, setMessages] = useState([]);
  const { name } = route.params;

  useEffect(() => {
    const messagesCollection = collection(db, "messages");
    const q = query(messagesCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesFirestore = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: new Date(doc.data().createdAt.seconds * 1000),
        user: doc.data().user
      })).reverse();
      setMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, [db]);

  const onSend = useCallback((newMessages = []) => {
    const { _id, createdAt, text, user } = newMessages[0];
    addDoc(collection(db, "messages"), {
      _id,
      createdAt,
      text,
      user
    });
  }, [db]);

  const renderBubble = useCallback((props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  ), []);

  return (
    <Fragment>
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding" // Changed from "height" to "padding"
          keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0} // Approximate offset
        >
          <View style={styles.container}>
            <GiftedChat
              messages={messages}
              renderBubble={renderBubble}
              onSend={messages => onSend(messages)}
              user={{
                _id: route.params.uid,
                name
              }}
            />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.container}>
          <GiftedChat
            messages={messages}
            renderBubble={renderBubble}
            onSend={messages => onSend(messages)}
            user={{
              _id: route.params.uid,
              name
            }}
          />
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;


