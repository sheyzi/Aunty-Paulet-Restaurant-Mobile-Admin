import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GlobalStyles, color } from "../styles/GlobalStyles";
import { Formik } from "formik";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from "yup";
import { AuthContext } from "../config/context";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username cannot be empty"),
  password: Yup.string().required("Password cannot be empty"),
});

export default function Login() {
  const { signIn } = React.useContext(AuthContext);
  const passwordRef = React.useRef();
  const handleLogin = (values) => {
    signIn(values);
  };

  return (
    <View style={GlobalStyles.authPageContainer}>
      <View style={GlobalStyles.logoContainer}>
        <Image
          source={require("../assets/adaptive-icon.png")}
          style={GlobalStyles.logo}
        />
      </View>
      <View
        behavior="position"
        // keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ flex: 1 }}
      >
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => handleLogin(values)}
          validationSchema={LoginSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              {/*Username Field*/}
              <View style={GlobalStyles.control}>
                <AntDesign name="user" size={24} color="black" />
                <TextInput
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  style={GlobalStyles.input}
                  placeholder="Username"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current.focus()}
                  autoCompleteType="username"
                />
              </View>
              {errors.username && touched.username ? (
                <Text style={GlobalStyles.errorText}>{errors.username}</Text>
              ) : null}

              {/*Password Field*/}
              <View style={GlobalStyles.control}>
                <AntDesign name="key" size={24} color="black" />
                <TextInput
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="Password"
                  secureTextEntry={true}
                  style={GlobalStyles.input}
                  ref={passwordRef}
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit}
                  autoCompleteType="password"
                />
              </View>
              {errors.password && touched.password ? (
                <Text style={GlobalStyles.errorText}>{errors.password}</Text>
              ) : null}

              {/*Button*/}
              <View style={GlobalStyles.buttonContainer}>
                <TouchableOpacity
                  style={GlobalStyles.button}
                  onPress={handleSubmit}
                >
                  <Text style={GlobalStyles.buttonText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 5,
    alignItems: "center",
  },
  input: {
    margin: 20,
    padding: 5,
    fontFamily: "nunito-regular",
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: color.light,
  },
});
