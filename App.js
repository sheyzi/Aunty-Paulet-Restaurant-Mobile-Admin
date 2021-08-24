import React from "react";
import { useFonts } from "expo-font";

import { StatusBar } from "expo-status-bar";
import { Alert, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import Toast from "react-native-toast-message";
import * as SecureStore from "expo-secure-store";
import { GlobalStyles, color } from "./styles/GlobalStyles";
import { AuthContext } from "./config/context";
import axios from "./config/axiosConfig";

import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import AuthStack from "./navigation/AuthStack";
import AppStack from "./navigation/AppStack";

import SplashScreen from "./screens/SplashScreen";
import { registerForPushNotificationsAsync } from "./helpers";
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://88efe9119d7748cd96f735304f868e61@o969494.ingest.sentry.io/5921023",
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  let [fontsLoaded] = useFonts({
    "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
  });

  const getUserToken = async (username, password) => {
    const params = `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`;
    const headers = {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    var dataToken;
    await axios
      .post("/users/token", params, headers)
      .then((res) => {
        dataToken = res.data.access_token;
        return dataToken;
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: err.response.data.detail,
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          height: 100,
          bottomOffset: 40,
        });
        throw err.response.data.detail;
      });
    return dataToken;
  };

  const saveToken = async (token) => {
    await SecureStore.setItemAsync("userToken", token);
  };

  const fetchToken = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      return token;
    } else {
      return null;
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    fetchToken().then((res) => {
      if (res != null) {
        setUserToken(res);
      } else {
        console.log("User needs to signin");
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const deleteToken = async () => {
    await SecureStore.deleteItemAsync("userToken");
  };

  const isUserAdmin = async (token) => {
    await axios
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.is_admin) {
          console.log("User is admin");
        } else {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "Not Restaurant Admin",
            text2: "You must be an admin user to use this app!!",
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            height: 100,
            bottomOffset: 40,
          });
          throw "User is not admin";
        }
      })
      .catch((err) => {
        console.log(err.response);
        Sentry.Native.captureException(err);
        throw err;
      });
  };

  const authContext = React.useMemo(() => {
    return {
      signIn: async ({ username, password }) => {
        setIsLoading(true);
        getUserToken(username, password)
          .then((value) => {
            isUserAdmin(value)
              .then((res) => {
                console.log(value);
                setUserToken(value);
                saveToken(value);

                Toast.show({
                  type: "success",
                  position: "bottom",
                  text1: "Hurray 🎉",
                  text2: "Sign in successful",
                  visibilityTime: 4000,
                  autoHide: true,
                  topOffset: 30,
                  height: 100,
                  bottomOffset: 40,
                });
              })
              .catch((err) => {
                console.log(err.response);
                Sentry.Native.captureException(err);
              });
          })
          .catch((err) => {
            console.log(err);
            Sentry.Native.captureException(err);
          });
        setIsLoading(false);
      },
      signOut: async () => {
        setIsLoading(true);
        await deleteToken()
          .then(() => {
            setUserToken(null);
          })
          .catch((err) => {
            console.log(err);
            Sentry.Native.captureException(err);
          });

        setIsLoading(false);
        Toast.show({
          type: "info",
          position: "bottom",
          text1: "Sign out successful",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          height: 100,
          bottomOffset: 40,
        });
      },

      userToken: async () => {
        var token = null;
        await fetchToken().then((res) => {
          if (res != null) {
            token = res;
          } else {
            console.log("User needs to signin");
          }
        });
        // console.log("Token", token);
        return token;
      },
    };
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <SplashScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {userToken ? <AppStack /> : <AuthStack />}
      </TouchableWithoutFeedback>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <StatusBar style="dark" backgroundColor={color.white} />
    </AuthContext.Provider>
  );
}
