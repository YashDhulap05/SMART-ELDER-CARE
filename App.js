import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ElderProfileScreen from "./screens/ElderProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Guardian Login" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Guardian Registration" }}
        />
        <Stack.Screen
          name="ElderProfile"
          component={ElderProfileScreen}
          options={{ title: "Elder Profile" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
