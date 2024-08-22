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
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { RouteNames } from "../../navigation/routesNames";
import { btoa, atob } from "react-native-quick-base64";

export const Login = () => {
  const { navigate } = useNavigation();
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function confirmCode(code) {
    try {
      console.log("code", code);
      await confirm.confirm(code);
      console.log("Done!!!");
    } catch (error) {
      console.log("Invalid code.");
    }
  }
  const signInWithPhoneNumber = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error));
      console.log("Error", error);
    }
  };

  const LoginSchema = Yup.object().shape({
    mobile: Yup.string(),
    otp: Yup.number(),
  });
  function addCountryCode(number) {
    if (!number.startsWith("+91")) {
      return "+91" + number;
    }
    return number;
  }
  const formik = useFormik({
    validationSchema: LoginSchema,
    initialValues: {
      mobile: "",
      otp: 0,
    },
    onSubmit: async (values) => {
      //   checkUser();

      // navigate(RouteNames.OTP, {
      //   confirm: "",
      //   mobile: formik.values.mobile,
      // });
      setLoading(true);
      const updatedNumber = addCountryCode(values.mobile);
      formik.setFieldValue("mobile", updatedNumber);
      signInWithPhoneNumber(updatedNumber);
    },
  });

  useEffect(() => {
    if (confirm) {
      setLoading(false);
      navigate(RouteNames.OTP, {
        confirm: confirm,
        mobile: formik.values.mobile,
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
          <View
            style={{ display: "flex", flexDirection: "column", rowGap: 17 }}
          >
            <Text
              style={[
                GlobalStyle.TextStyle700_20_25,
                { fontSize: 30, lineHeight: 0 },
              ]}
            >
              Login!
            </Text>
            <Text
              style={[
                GlobalStyle.TextStyle600_20_27,
                { lineHeight: 0, color: "#424242" },
              ]}
            >
              Welcome back!
            </Text>
          </View>
          <View style={{ marginTop: 27 }}></View>
          <Image
            source={require("../../assets/Login_icon.png")}
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
                Mobile No :
              </Text>
              <CustomTextInput
                inputType="Text"
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
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
            {/* <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text style={[GlobalStyle.TextStyle400_25_16, { fontSize: 14 }]}>
                OTP
              </Text>
              <CustomTextInput
                inputType="Text"
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                inputContainerStyle={{
                  borderColor: "#D0D5DD",
                  borderRadius: 8,
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
                value={formik.values.otp}
                onChangeText={(text) => {
                  formik.setFieldValue("otp", text);
                }}
              />
            </View> */}
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
                Login
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
          >
            Dont't have an account? SIGNUP
          </Text>
          <Image
            source={require("../../assets/SpanLogo.png")}
            style={{
              height: 54,
              width: 156,
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginTop: 30,
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
