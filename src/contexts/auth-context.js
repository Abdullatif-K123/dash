import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { API_ROUTES } from "src/utils/apiConfig";
const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  FORGET_PASS: "FORGET_PASS",
  FOGET_PASSOTP: "FORGET_PASSOTP",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  email: "",
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;
    const email = action.payloadEmail;
    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
      email: email || "",
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = typeof action.payload === "object" ? action.payload.user : action.payload;
    const email = action.payload.email;
    console.log(action);
    return {
      ...state,
      isAuthenticated: true,
      user,
      email: email || "",
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  console.log(state);
  const initialize = async () => {
    initialized.current = true;

    let isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
    const user = window.sessionStorage.getItem("user");
    try {
      isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };
  const forgetOtp = async (otp, token) => {
    try {
      const response = await axios.post(
        API_ROUTES.auth.forgetOtp,
        { token: token, otp: otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { user: response.data.returnData.token, email: state.email },
      });
      return "";
    } catch (error) {
      return error.response.data.errorMessage;
    }
  };
  const resetPass = async (newPass, confirmPass, token) => {
    try {
      const response = await axios.post(
        API_ROUTES.auth.resetPass,
        {
          token: token,
          newPassword: newPass,
          confirmPassword: confirmPass,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {}
  };
  const forgetPass = async (email) => {
    try {
      const response = await axios.post(
        API_ROUTES.auth.forgetPass,
        { emailAddress: email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const user = response.data.returnData.token;

      console.log(response.data.returnData.token);
      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { user: response.data.returnData.token, email: email },
      });
      return "";
    } catch (error) {
      console.log(error.response.data.errorMessage);
      return error.response.data.errorMessage;
    }
  };
  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        API_ROUTES.auth.post,
        {
          emailAddress: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      const user = response.data.returnData.token;

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });
      // Set authentication status in sessionStorage
      window.sessionStorage.setItem("authenticated", "true");
      window.sessionStorage.setItem("user", user);
    } catch (error) {
      throw new Error("Please check your email and password");
    }
  };

  const signUp = async (email, name, password) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    window.sessionStorage.setItem("authenticated", "false");
    window.sessionStorage.setItem("user", "");
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        forgetPass,
        forgetOtp,
        resetPass,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
