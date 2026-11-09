import { useDispatch } from "react-redux";

import AuthContent from "../components/auth/AuthContent";

import { login } from "../utils/authDataService";

import { authActions } from "../store/authSlice";

function LoginScreen() {
  const dispatch = useDispatch();

  async function loginHandler({ login: enteredLogin, password }) {
    try {
      const response = await login(enteredLogin, password);

      if (response.status !== 200) {
        return;
      }

      dispatch(
        authActions.authenticate({
          login: enteredLogin,
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );
    } catch (error) {
      console.log(
        "Login failed:",
        error.response?.data || error.message
      );
    }
  }

  return (
    <AuthContent
      isLogin={true}
      onAuthenticate={loginHandler}
    />
  );
}

export default LoginScreen;