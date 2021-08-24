import React from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import { StatusBar } from "expo-status-bar";
import OrderDetails from "../screens/OrderDetails";

import { GlobalStyles, color } from "../styles/GlobalStyles";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={{ flex: 1 }}>
				<Stack.Navigator headerMode="none">
					<Stack.Screen
						name="Home"
						component={Home}
						options={{ unmountOnBlur: false, headerShown: false }}
					/>
					<Stack.Screen
						name="OrderDetails"
						component={OrderDetails}
						options={{
							unmountOnBlur: false,
							title: "Order Details",
							headerStyle: {
								backgroundColor: color.primary,
							},
							headerTintColor: "#fff",
							headerTitleStyle: {
								fontFamily: "nunito-bold",
							},
						}}
					/>
				</Stack.Navigator>
				<StatusBar style="light" />
			</View>
		</TouchableWithoutFeedback>
	);
}
