import React from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { GlobalStyles, color } from "../styles/GlobalStyles";
import { AuthContext } from "../config/context";

export default function More() {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={GlobalStyles.container}>
      <View style={GlobalStyles.buttonContainer}>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            signOut();
          }}
        >
          <Text style={GlobalStyles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
