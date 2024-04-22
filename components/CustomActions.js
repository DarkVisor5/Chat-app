import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CustomActions = ({
  onSend,
  storage,
  userID,
  createImageMessage,
  createLocationMessage

}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const generateReference = (uri) => {
    if (!uri) {
      console.error('No URI provided for generateReference');
      return `${userID}-${Date.now()}-default-filename`;
    }
    const timeStamp = Date.now();
    const imageName = uri.split("/").pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (uri) => {
    try {
      const uniqueRefString = generateReference(uri);
      const storageRef = ref(storage, uniqueRefString);
      const response = await fetch(uri);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      const imageMessage = createImageMessage(Date.now(), { _id: userID }, downloadUrl);
      onSend([imageMessage]);
    } catch (error) {
      console.error("Error uploading and sending image:", error);
    }
  };

  const handleImageAction = async (actionType) => {
    let permissions = await (actionType === 'library'
      ? ImagePicker.requestMediaLibraryPermissionsAsync()
      : ImagePicker.requestCameraPermissionsAsync());

    if (!permissions.granted) {
      alert("Camera permission is required to make this work!");
      return;
    }

    let result = actionType === 'library' ? await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    }) : await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log("Image URI:", result.assets[0].uri);
      await uploadAndSendImage(result.assets[0].uri);
    } else {
      console.log("Image picking was canceled or no URI found");
    }
  };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions.granted) {
      // Specify high accuracy
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      const locationMessage = createLocationMessage(Date.now(), { _id: userID }, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      onSend([locationMessage]);
    } else {
      alert("Permission to access location was denied");
    }
  };
  

  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            handleImageAction('library');
            break;
          case 1:
            handleImageAction('camera');
            break;
          case 2:
            getLocation();
            break;
          default:
            break;
        }
      }
    );
  };

  return (
    <TouchableOpacity onPress={onActionPress}>
      <Text style={{ padding: 10, color: 'blue' }}>+</Text>
    </TouchableOpacity>
  );
};

export default CustomActions;






