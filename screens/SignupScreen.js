import { useDispatch } from "react-redux";

import AuthContent from "../components/auth/AuthContent";

import {
  createUser,
  login,
} from "../utils/authDataService";

import { authActions } from "../store/authSlice";

function SignupScreen() {
  const dispatch = useDispatch();

  async function signupHandler({ login: enteredLogin, password }) {
    try {
      // Реєстрація
      const signupResponse = await createUser(
        enteredLogin,
        password
      );

      // Якщо реєстрація неуспішна, зупиняємо виконання
      if (signupResponse.status !== 200) {
        return;
      }

      // Автоматичний вхід
      const response = await login(
        enteredLogin,
        password
      );

      if (
        response.status !== 200 ||
        !response.data?.accessToken
      ) {
        return;
      }

      // Зберігаємо токени
      dispatch(
        authActions.authenticate({
          login: enteredLogin,
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
    } catch (error) {
      console.log(
        "Signup failed:",
        error.response?.data || error.message
      );
    }
  }

  return (
    <AuthContent
      onAuthenticate={signupHandler}
    />
  );
}

export default SignupScreen;