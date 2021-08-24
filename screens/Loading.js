import React from "react";
import { Text, View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { GlobalStyles, color } from "../styles/GlobalStyles";

export default function Loading() {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={color.primary} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.white,
		justifyContent: "center",
		alignItems: "center",
	},
});
