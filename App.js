  // Import the screens we want to navigate
  import Start from './components/Start';
  import Chat from './components/Chat';

  // Import React Navigation
  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';

  // Create the navigator
  const Stack = createNativeStackNavigator();

  const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            
            options={({ route }) => ({
              title: route.params.name,
              headerStyle: {
                backgroundColor: route.params.backgroundColor,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  export default App;

