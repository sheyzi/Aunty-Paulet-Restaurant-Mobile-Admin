import React from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import More from "../screens/More";
import Product from "../screens/Product";
import { GlobalStyles, color } from "../styles/GlobalStyles";
import HomeStack from "./HomeStack";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppStack() {
	return (
		<NavigationContainer>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === "HomeStack") {
								iconName = focused ? "home" : "home-outline";
							} else if (route.name === "Product") {
								iconName = focused
									? "fast-food"
									: "fast-food-outline";
							} else if (route.name === "More") {
								iconName = focused ? "apps" : "apps-outline";
							}

							// You can return any component that you like here!
							return (
								<Ionicons
									name={iconName}
									size={size}
									color={color}
								/>
							);
						},
						tabBarActiveTintColor: color.primary,
						tabBarInactiveTintColor: color.light2,
					})}
				>
					<Tab.Screen
						name="HomeStack"
						component={HomeStack}
						options={{
							headerShown: false,
							unmountOnBlur: true,
							title: "Home",
						}}
					/>
					<Tab.Screen
						name="Product"
						component={Product}
						options={{ headerShown: false }}
					/>
					<Tab.Screen
						name="More"
						component={More}
						options={{ headerShown: false }}
					/>
				</Tab.Navigator>
			</TouchableWithoutFeedback>
		</NavigationContainer>
	);
}
