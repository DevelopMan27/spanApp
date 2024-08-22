import {
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
import { useEffect, useState } from "react";
import { GlobalAppColor, GlobalStyle } from "../../CONST";
import { CustomTextInput } from "../../components/CustomTextInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../type";
import { RouteNames } from "../../navigation/routesNames";
import { useAuthContext } from "../../contexts/UserAuthContext";
import { btoa, atob } from "react-native-quick-base64";
import { RegistrationConfirmation } from "../../components/RegistrationConfirmation/index";
import { storeData } from "../../utils";

type OTPProps = RouteProp<RootStackParamList, RouteNames.OTP>;
export const OTP = () => {
  const navigation = useNavigation();
  const route = useRoute<OTPProps>();
  const { setAPIUSER } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);
  const { confirm, designation, email, mobile, name } = route?.params;

  const LoginSchema = Yup.object().shape({
    otp: Yup.string(),
  });
  function removeCountryCode(mobileNumber) {
    // Remove any leading +91 or 91
    mobileNumber = mobileNumber.replace(/^(\+91|91)/, "");
    // Trim any leading or trailing whitespace
    mobileNumber = mobileNumber.trim();
    return mobileNumber;
  }
  const formik = useFormik({
    validationSchema: LoginSchema,
    initialValues: {
      otp: "",
    },
    onSubmit: async (values) => {
      // if (!confirm) {
      try {
        const confirmation = await confirm.confirm(values.otp);
        // console.log("Done! Verified!");
        if (name && email && designation) {
          const token = "";
          const dObject = {
            authorization: token,
            input: {
              mobile: mobile,
              username: name,
              email: email,
              designation: designation,
              // fb_uid: "",
              fb_uid: confirmation?.user.uid,
            },
          };
          const encodedData = btoa(JSON.stringify(dObject));
          const finalData = { data: encodedData };
          const response = await fetch(
            "https://hum.ujn.mybluehostin.me/span/v1/registration.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(finalData),
            }
          );
          const result = await response.json();
          console.log("==result", result);
          if (result.data && result.success) {
            setModalVisible(true);
          } else {
            Alert.alert("User can't register", result?.message);
          }
        } else {
          const mobilenum = removeCountryCode(mobile);
          const token = "";
          // console.log("mobile", c);
          const dObject = {
            authorization: token,
            input: {
              mobile: mobilenum,
              Fcm_token: "",
            },
          };
          const encodedData = btoa(JSON.stringify(dObject));
          const finalData = { data: encodedData };
          console.log("finalData", finalData);
          const response = await fetch(
            "https://hum.ujn.mybluehostin.me/span/v1/login.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(finalData),
            }
          );
          const result = await response.json();
          console.log("Login result", result.data);
          if (result.data && result.success) {
            await storeData("USER_DATA", JSON.stringify(result?.data));
            await storeData("USER_TOKEN", JSON.stringify(result?.data?.token));
            await storeData("EXPIRY_DATE", JSON.stringify(result?.data?.eat));
            setAPIUSER(true);
          } else {
            Alert.alert("Error while Login", result.message);
          }
        }
      } catch (error) {
        Alert.alert("Invalid OTP");
      }
      // }
    },
  });

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
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 17,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={[GlobalStyle.TextStyle700_20_25, { lineHeight: 0 }]}>
              VERIFICATION CODE
            </Text>
          </View>
          <View style={{ marginTop: 54 }}></View>

          <Image
            source={require("../../assets/Login_icon.png")}
            style={{ height: 172.14, width: "100%" }}
          />
          <View style={{ marginTop: 15.86 }}></View>
          <View
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              marginTop: 47,
            }}
          >
            <Text
              style={[
                GlobalStyle.TextStyle400_25_16,
                { fontSize: 14, lineHeight: 25 },
              ]}
            >
              Verification code sent to {mobile}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 14,
              marginTop: 54,
            }}
          >
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text style={[GlobalStyle.TextStyle400_25_16, { fontSize: 14 }]}>
                OTP :
              </Text>
              <CustomTextInput
                inputType="Text"
                placeholder="Enter OTP"
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
          >
            <Text
              style={[
                GlobalStyle.TextStyle500_25_16,
                { fontSize: 16, color: GlobalAppColor.White },
              ]}
            >
              Verify
            </Text>
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
            Resend code
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
      {modalVisible && (
        <RegistrationConfirmation
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
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
