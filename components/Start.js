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

const colors = {
  black: '#090C08',
  purple: '#474056',
  grey: '#8A95A5',
  green: '#B9C6AE',
};

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
          <Text style={styles.colorText}>Choose Background Color:</Text>
          <ColorSelector onSelectColor={setBackgroundColor} selectedColor={backgroundColor} />
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
    width: '88%',
    height: '44%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '6%',
    position: 'absolute',
    bottom: '6%',
    left: '6%',
    right: '6%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
    marginBottom: 20,
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
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  colorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    alignSelf: 'flex-start',
    paddingLeft: '6%',
  },
});
