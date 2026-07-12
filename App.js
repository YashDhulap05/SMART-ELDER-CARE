import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "./screens/DashboardScreen";
import ElderProfileScreen from "./screens/ElderProfileScreen";
import EmergencyRecordingScreen from "./screens/EmergencyRecordingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VoiceRecordingScreen from "./screens/VoiceRecordingScreen";
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
          name="EmergencyRecording"
          component={EmergencyRecordingScreen}
          options={{ title: "Emergency Message" }}
        />
        <Stack.Screen
          name="ElderProfile"
          component={ElderProfileScreen}
          options={{ title: "Elder Profile" }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: "Dashboard",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="VoiceRecording"
          component={VoiceRecordingScreen}
          options={{ title: "Record Voice Message" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
