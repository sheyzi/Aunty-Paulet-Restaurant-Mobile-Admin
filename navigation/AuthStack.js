import React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
	return (
		<NavigationContainer>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<Stack.Navigator
					headerMode="none"
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="Login" component={Login} />
				</Stack.Navigator>
			</TouchableWithoutFeedback>
		</NavigationContainer>
	);
}
