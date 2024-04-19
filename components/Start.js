import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';

// Color options for user to select the chat background
const colors = {
  black: '#090C08',
  purple: '#474056',
  grey: '#8A95A5',
  green: '#B9C6AE',
};

// Component for selecting a background color
const ColorSelector = ({ onSelectColor, selectedColor }) => (
  <View style={styles.colorSelector}>
    {Object.keys(colors).map((key) => (
      <View
        key={key}
        style={[
          styles.colorButtonWrapper,
          selectedColor === colors[key] ? styles.selectedColorWrapper : {},
        ]}>
        <TouchableOpacity
          style={[
            styles.colorButton,
            { backgroundColor: colors[key] },
          ]}
          onPress={() => onSelectColor(colors[key])}
        />
      </View>
    ))}
  </View>
);

// Start screen component where users enter their name and select background color
export default function Start({ navigation }) {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(colors.black);
  const [isFocusedOrNotEmpty, setIsFocusedOrNotEmpty] = useState(false);


  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/backg.png')}
        style={styles.imageBackground}
      >
        <Text style={styles.title}>App Title</Text>
        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            {!isFocusedOrNotEmpty && (
              <Image
                source={require('../assets/input.png')}
                style={styles.inputIcon}
              />
            )}
            <TextInput
              style={styles.nameInput}
              onChangeText={(text) => {
                setName(text);
                setIsFocusedOrNotEmpty(text.length > 0);
              }}
              value={name}
              onFocus={() => setIsFocusedOrNotEmpty(true)}
              onBlur={() => setIsFocusedOrNotEmpty(name.length > 0)}
              placeholder="Your Name"
              placeholderTextColor="#75708350"
            />

          </View>
          <View style={styles.colorContainer}>
            <Text style={styles.colorText}>Choose Background Color:</Text>
            <ColorSelector onSelectColor={setBackgroundColor} selectedColor={backgroundColor} />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('Chat', { name, backgroundColor });
            }}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: '20%',
  },
  contentContainer: {
    flex: 1,
    width: '88%',
    height: '44%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between', // Adjust space distribution
    padding: '6%',
    position: 'absolute',
    bottom: '6%',
    left: '6%',
    right: '6%',
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
    marginBottom: 20, // Keep or adjust based on space needed
  },
  
  inputIcon: {
    marginRight: 10,
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorSelector: {
    flexDirection: 'row',
    width: '88%',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  colorButtonWrapper: {
    padding: 2,
    borderRadius: 24,
    marginHorizontal: 6,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorWrapper: {
    borderColor: '#757083',
    borderWidth: 2,
    borderRadius: 24
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#474056', // Ensure it's visible
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  colorContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,  // Add top margin if needed
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    alignSelf: 'flex-start',
    paddingLeft: '6%',
  },
  colorSelector: {
  flexDirection: 'row',
  justifyContent: 'center',  // Centers the color buttons in the container
  width: '100%',  // Use full width of the container
},
});
