import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useRouter } from "next/router";
const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

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
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
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
  const router = useRouter();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
    const user = window.sessionStorage.getItem("user");
    console.log(user);
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      router.push("/auth/login");
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
      router.replace("/");
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

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        "https://gaca.somee.com/api/Auth/Login",
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
      payload: "null",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
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
