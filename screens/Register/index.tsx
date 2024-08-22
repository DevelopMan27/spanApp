import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GlobalAppColor, GlobalStyle } from "../../CONST";
import { CustomTextInput } from "../../components/CustomTextInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Buffer } from "buffer";
import { useNavigation } from "@react-navigation/native";
import { btoa, atob } from "react-native-quick-base64";
import { RouteNames } from "../../navigation/routesNames";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const Register = () => {
  const { navigate } = useNavigation();
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult>();
  const [loading, setLoading] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .matches(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required("Please enter valid email."),
    mobile: Yup.string()
      // .matches(/^[6-9]\d{9}$/, "Please enter a valid mobile number.")
      .required("Mobile number is required."),
    name: Yup.string().required("Please enter name"),
    designation: Yup.string().required("Please enter designation"),
  });

  async function signInWithPhoneNumber(phoneNumber: string) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  const login = async (value: {
    email: string;
    mobile: string;
    name: string;
    designation: string;
  }) => {
    console.log("VVVV", value);

    // Create the registration data object
    // const token = "";
    // const dObject = {
    //   authorization: token,
    //   input: {
    //     mobile: value.mobile,
    //     username: value.name,
    //     email: value.email,
    //     designation: value.designation,
    //     fb_uid: "Firebase Uid",
    //   },
    // };
    // const encodedData = btoa(JSON.stringify(dObject));
    // const finalData = { data: encodedData };
    // console.log("====finalData====", finalData);

    // Send the POST request to the registration endpoint
    // const response = await fetch(
    //   "https://hum.ujn.mybluehostin.me/span/v1/registration.php",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(finalData),
    //   }
    // );

    // const result = await response.json();
    // console.log("result", result);

    // if (result.success) {
    //   Alert.alert("Registration Successful", `User ID: ${result.data}`);
    // } else {
    //   Alert.alert("Registration Failed", result.message);
    // }
  };
  function addCountryCode(number) {
    if (!number.startsWith("+91")) {
      return "+91" + number;
    }
    return number;
  }
  const formik = useFormik({
    validationSchema: LoginSchema,
    initialValues: {
      email: "",
      mobile: "",
      name: "",
      designation: "",
    },
    onSubmit: async (values) => {
      // navigate(RouteNames.OTP, {
      //   confirm: "",
      //   name: formik.values.name,
      //   mobile: formik.values.mobile,
      //   email: formik.values.email,
      //   designation: formik.values.designation,
      // });
      setLoading(true);
      const updatedNumber = addCountryCode(values.mobile);
      formik.setFieldValue("mobile", updatedNumber);
      await signInWithPhoneNumber(updatedNumber);
    },
  });

  useEffect(() => {
    if (
      confirm &&
      formik.values.name &&
      formik.values.mobile &&
      formik.values.email &&
      formik.values.designation
    ) {
      setLoading(false);
      navigate(RouteNames.OTP, {
        confirm: confirm,
        name: formik.values.name,
        mobile: formik.values.mobile,
        email: formik.values.email,
        designation: formik.values.designation,
      });
    }
  }, [confirm, formik.values, setLoading, loading]);

  return (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ display: "flex", flex: 1 }}
      >
        <ScrollView
          style={{
            display: "flex",
            flex: 1,
            paddingHorizontal: 25,
          }}
        >
          <View style={{ marginTop: 25 }}></View>
          <Text
            style={[
              GlobalStyle.TextStyle700_20_25,
              { fontSize: 30, lineHeight: 0 },
            ]}
          >
            Registration!
          </Text>
          <View style={{ marginTop: 27 }}></View>
          <Image
            source={require("../../assets/LoginImage.png")}
            style={{ height: 172.14, width: "100%" }}
          />
          <View style={{ marginTop: 15.86 }}></View>
          <View
            style={{ display: "flex", flexDirection: "column", rowGap: 14 }}
          >
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text style={[GlobalStyle.TextStyle400_25_16, { fontSize: 14 }]}>
                Name :
              </Text>
              <CustomTextInput
                inputType="Text"
                placeholder="Enter your name"
                inputContainerStyle={{
                  borderColor: "#D0D5DD",
                  borderRadius: 8,
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
                value={formik.values.name}
                onChangeText={(text) => {
                  formik.setFieldValue("name", text);
                }}
              />
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text style={[GlobalStyle.TextStyle400_25_16, { fontSize: 14 }]}>
                Mobile No :
              </Text>
              <CustomTextInput
                inputType="Text"
                keyboardType="number-pad"
                placeholder="Mobile"
                inputContainerStyle={{
                  borderColor: "#D0D5DD",
                  borderRadius: 8,
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
                value={formik.values.mobile}
                onChangeText={(text) => {
                  formik.setFieldValue("mobile", text);
                }}
              />
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text style={[GlobalStyle.TextStyle400_25_16, { fontSize: 14 }]}>
                Email address :
              </Text>
              <CustomTextInput
                inputType="Text"
                keyboardType="default"
                placeholder="Enter your email "
                inputContainerStyle={{
                  borderColor: "#D0D5DD",
                  borderRadius: 8,
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
                value={formik.values.email}
                onChangeText={(text) => {
                  formik.setFieldValue("email", text);
                }}
              />
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text style={[GlobalStyle.TextStyle400_25_16, { fontSize: 14 }]}>
                Designation :
              </Text>
              <CustomTextInput
                inputType="Text"
                keyboardType="default"
                placeholder="Admin | Super User | Regular User"
                inputContainerStyle={{
                  borderColor: "#D0D5DD",
                  borderRadius: 8,
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
                value={formik.values.designation}
                onChangeText={(text) => {
                  formik.setFieldValue("designation", text);
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 26 }}></View>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={() => formik.handleSubmit()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={GlobalAppColor.AppWhite} />
            ) : (
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 16, color: GlobalAppColor.White },
                ]}
              >
                Submit
              </Text>
            )}
          </Pressable>
          <View style={{ marginTop: 15 }}></View>
          <Text
            style={[
              {
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
              },
              GlobalStyle.TextStyle400_25_16,
              { fontSize: 14, lineHeight: 25 },
            ]}
            onPress={() => {
              navigate("Login");
            }}
          >
            Already registered ? Login Now
          </Text>
          <Image
            source={require("../../assets/SpanLogo.png")}
            style={{
              height: 54,
              width: 156,
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: 21,
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 31,
    paddingBottom: 29,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  button: {
    display: "flex",
    height: 48,
    width: "auto",
    backgroundColor: "#0A509C",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
  },
  pressed: {
    backgroundColor: "#083D75",
  },
});
