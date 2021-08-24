import React from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { GlobalStyles, color } from "../styles/GlobalStyles";
import { AuthContext } from "../config/context";
import { LinearGradient } from "expo-linear-gradient";
import axios from "../config/axiosConfig";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { registerForPushNotificationsAsync } from "../helpers";
import Loading from "./Loading";
import * as Sentry from "sentry-expo";

import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Home({ navigation }) {
  const [user, setUser] = React.useState({});
  const [userToken, setUserToken] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [pendingOrders, setPendingOrders] = React.useState([]);

  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  const showOrderDetails = (id) => {
    navigation.navigate("OrderDetails", {
      id: id,
    });
  };

  const getValueAsync = async () => {
    const result = await SecureStore.getItemAsync("userToken");
    setUserToken(result);
    getUserData(result);
    getProducts(result);
    getCustomers(result);
    getOrders(result);
    getPendingOrders(result);

    registerForPushNotificationsAsync(result);
  };
  const getCustomers = async (token) => {
    axios
      .get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCustomers(res.data);
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
        Sentry.Native.captureException(err);
      });
  };

  const getOrders = async (token) => {
    axios
      .get("/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data);
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
        Sentry.Native.captureException(err);
      });
  };

  const getPendingOrders = async (token) => {
    axios
      .get("/admin/orders/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPendingOrders(res.data);
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
        Sentry.Native.captureException(err);
      });
  };

  const getUserData = async (token) => {
    await axios
      .get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
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
        console.log(err.response);
        Sentry.Native.captureException(err);
      });
  };

  const getProducts = async (token) => {
    await axios
      .get("/products")
      .then((res) => {
        setProducts(res.data);
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
        Sentry.Native.captureException(err);
      });
  };

  React.useEffect(() => {
    getValueAsync();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        let body =
          response.notification.request.trigger.remoteMessage.data.body;

        body = JSON.parse(body);

        if (body.screen) {
          let screenName = body.screen;
          if (body.screen_params) {
            let params = body.screen_params;
            navigation.navigate(screenName, params);

            return;
          }
          navigation.navigate(screenName);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  if (!products.length || !pendingOrders.length || !customers.length) {
    return <Loading />;
  }

  return (
    <View style={GlobalStyles.container}>
      {/* <Text style={GlobalStyles.title}>Hello {user.username}!!</Text> */}
      <View style={styles.gridView}>
        <LinearGradient
          colors={[color.primary, "#F94A3A"]}
          style={styles.gridItem}
        >
          <Text style={styles.title}>{orders.length}</Text>
          <Text style={styles.subtitle}>Orders</Text>
        </LinearGradient>

        <LinearGradient colors={["#86CAF1", "#20A4F3"]} style={styles.gridItem}>
          <Text style={styles.title}>{pendingOrders.length}</Text>
          <Text style={styles.subtitle}>Pending Orders</Text>
        </LinearGradient>
      </View>
      <Text
        style={{
          fontSize: 24,
          fontFamily: "nunito-bold",
          paddingHorizontal: 10,
          marginVertical: 5,
          color: color.primary,
        }}
      >
        Pending Orders
      </Text>
      <FlatList
        data={pendingOrders}
        style={styles.list}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <View style={styles.listItemUpper}>
                <Text style={styles.subtitleMain}>
                  <Text style={{ color: color.primary, fontSize: 16 }}>
                    Receiver Name:
                  </Text>{" "}
                  {item.receiver_name}
                </Text>
                <Text style={styles.subtitleMain}>
                  <Text style={{ color: color.primary, fontSize: 16 }}>
                    Receiver Phone Number:
                  </Text>{" "}
                  {item.receiver_phone_number}
                </Text>

                <Text style={styles.subtitleMain}>
                  <Text style={{ color: color.primary, fontSize: 16 }}>
                    Order Amount:
                  </Text>{" "}
                  {"\u20A6"}
                  {item.amount - 300}
                </Text>
                <Text style={styles.subtitleMain}>
                  <Text style={{ color: color.primary, fontSize: 16 }}>
                    Shipping Fee:
                  </Text>{" "}
                  {"\u20A6"}300
                </Text>
                <Text style={styles.subtitleMain}>
                  <Text style={{ color: color.primary, fontSize: 16 }}>
                    Total Payment:
                  </Text>{" "}
                  {"\u20A6"}
                  {item.amount}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  showOrderDetails(item.id);
                }}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  gridView: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  list: {
    flex: 1,
    margin: 5,
  },
  listItemUpper: {
    padding: 10,
  },
  listItem: {
    margin: 5,
    backgroundColor: color.white,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    marginVertical: 10,
    elevation: 6,
  },
  gridItem: {
    backgroundColor: color.light,
    height: WIDTH / 3 - 20,
    width: WIDTH / 2 - 20,
    margin: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    paddingVertical: 5,
    fontFamily: "nunito-bold",
    color: color.white,
  },
  titleMain: {
    fontSize: 24,
    paddingVertical: 5,
    fontFamily: "nunito-bold",
  },
  subtitle: {
    fontSize: 16,
    paddingVertical: 5,
    fontFamily: "nunito-bold",
    color: color.white,
  },
  subtitleMain: {
    fontSize: 16,
    fontFamily: "nunito-bold",
  },
  buttonContainer: {
    width: "100%",
    backgroundColor: color.primary,
    borderRadius: 5,
    color: color.light,
    padding: 10,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "nunito-bold",
    fontSize: 18,
    color: color.white,
  },
});
