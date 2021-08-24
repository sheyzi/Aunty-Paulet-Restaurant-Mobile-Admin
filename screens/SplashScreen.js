import React from "react";
import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { GlobalStyles, color } from "../styles/GlobalStyles";

export default function SplashScreen() {
	return (
		<View style={GlobalStyles.authPageContainer}>
			<View style={GlobalStyles.logoContainer}>
				<Image
					source={require("../assets/adaptive-icon.png")}
					style={GlobalStyles.logo}
				/>
			</View>
			<View style={{ flex: 1 }}>
				<ActivityIndicator size="large" color={color.primary} />
			</View>
		</View>
	);
}
