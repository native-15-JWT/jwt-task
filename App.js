import { StatusBar } from "expo-status-bar";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { useDispatch, useSelector } from "react-redux";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

import IconButton from "./components/ui/IconButton";

import { authActions } from "./store/authSlice";

import { logout } from "./utils/authDataService";

const Stack = createNativeStackNavigator();

const COLORS = {
  primary500: "#72063c",
  primary100: "#f3dae5",
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary500,
        },
        headerTintColor: "white",
        contentStyle: {
          backgroundColor: COLORS.primary100,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
      />
    </Stack.Navigator>
  );
}

function EnteredStack() {
  const dispatch = useDispatch();

  const username = useSelector(
    (state) => state.auth.login
  );

  const refreshToken = useSelector(
    (state) => state.auth.refreshToken
  );

  async function logoutHandler() {
    try {
      await logout(refreshToken);
    } catch (error) {
      console.log("Logout failed:", error.message);
    } finally {
      dispatch(authActions.logout());
    }
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary500,
        },
        headerTintColor: "white",
        contentStyle: {
          backgroundColor: COLORS.primary100,
        },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          title: `Welcome to posts, ${username}!`,

          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={logoutHandler}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function InnerNavigation() {
  const token = useSelector(
    (state) => state.auth.token
  );

  return (
    <NavigationContainer>
      {token ? <EnteredStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <InnerNavigation />
    </>
  );
}