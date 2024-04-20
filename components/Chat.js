import { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";

// Main component for Chat functionality
const Chat = ({ route, navigation }) => {
  // State to hold messages
  const [messages, setMessages] = useState([]);
  const { name } = route.params;

  // Effect for setting initial messages and navigation title
  useEffect(() => {
    navigation.setOptions({ title: name })
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'You’ve entered the chat',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [navigation, name]);

  // Callback for sending messages
  const onSend = useCallback((newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }, []);

  // Custom render for message bubbles
  const renderBubble = useCallback((props) => {
    return <Bubble
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
  }, []);

  // Render the chat interface
  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
          name
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      />
    </View>
  );
}

// Styles for the chat container
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;

