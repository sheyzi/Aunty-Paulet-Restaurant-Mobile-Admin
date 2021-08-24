import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import axios from "../config/axiosConfig";
import Loading from "./Loading";
import { GlobalStyles, color } from "../styles/GlobalStyles";
import * as SecureStore from "expo-secure-store";
import * as Sentry from "sentry-expo";
import Toast from "react-native-toast-message";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function OrderDetails({ navigation, route }) {
	const [orderDetails, setOrderDetails] = React.useState(null);
	const { id } = route.params;
	const [userToken, setUserToken] = React.useState(null);
	const getOrderDetails = (token) => {
		const url = `/admin/order/${id}`;
		axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				setOrderDetails(res.data);
			})
			.catch((err) => {
				console.log(err);
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

	const getValueAsync = async () => {
		const result = await SecureStore.getItemAsync("userToken");
		setUserToken(result);
		getOrderDetails(result);
	};

	React.useEffect(() => {
		getValueAsync();
	}, []);

	if (!orderDetails) {
		return <Loading />;
	}
	return (
		<View style={styles.container}>
			<View style={styles.textBox}>
				<Entypo name="dot-single" size={40} color={color.primary} />
				<Text style={styles.title}>
					Receiver Name: {orderDetails.receiver_name}
				</Text>
			</View>
			<View style={styles.textBox}>
				<Entypo name="dot-single" size={40} color={color.primary} />
				<Text style={styles.title}>
					Receiver Name: {orderDetails.receiver_name}
				</Text>
			</View>
			<View style={styles.textBox}>
				<Entypo name="dot-single" size={40} color={color.primary} />
				<Text style={styles.title}>
					Phone Number: {orderDetails.receiver_phone_number}
				</Text>
				<Feather
					name="phone-call"
					size={24}
					color={color.primary}
					style={{ paddingHorizontal: 15 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.white,
	},
	subtitle: {
		fontSize: 16,
		fontFamily: "nunito-bold",
		paddingVertical: 5,
	},
	title: {
		fontSize: 18,
		fontFamily: "nunito-bold",
		paddingVertical: 5,
	},
	textBox: {
		flexDirection: "row",
		alignItems: "center",
	},
});
