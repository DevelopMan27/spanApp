import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera/next";
import { useEffect, useState } from "react";
import { GlobalAppColor, GlobalStyle } from "../../CONST";
import { useNavigation } from "@react-navigation/native";
import { NativeModules } from "react-native";
import { getUserData, getUserToken } from "../../utils";
import { btoa } from "react-native-quick-base64";

export const QRScan = () => {
  const { goBack, navigate } = useNavigation();
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const { MyNativeModule } = NativeModules;
  // const onScanResult = async (scanningResult: BarcodeScanningResult) => {
  //   // navigate("DeviceDetails");
  //   console.log("===== On click");
  //   try {
  //     const qrData =
  //       "252-252-252-252-252-252-5c6-16a-a2-312-da5-cee-718-668-718-910-65d-886-886-886-c05-c82-62-a74-bb1-bb1-668-a32-c90-86e-340-e2a-252-252-252-252-bff-bff-9ec-32c-581-a90-ef2-e59-884-1c5-a2b-229-65d-f36-886-886-dd1-3bc-8d0-886-886-312-a9e-e4b-58a-439-58a-bb1-2";
  //     const result = await MyNativeModule?.processQRCode(qrData);

  //     console.log("result", result);
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  //   // setResult(result);
  // };

  const onScanResult = async () => {
    // const { data } = scanningResult;
    console.log("===== On click");
    // console.log(data);
    const qrData =
      "252-252-252-252-252-252-252-252-252-252-252-252-5c6-16a-96-f3f-43f-a05-718-da5-718-c38-252-252-252-252-252-252-65d-886-45b-dd1-3e7-f36-f3f-f2a-683-56f-d06-e4b-56b-609-aee-b1f-bff-bff-bff-f7c-935-30-fcd-f33-f33-f33-662-ea3-662-910-718-3bd-ef2-ee9-ee9-1c5-21f-9c2-252-252-252-252-252-252-252-252-65d-f36-886-65d-dd1-b29-c05-f36-f36-c05-741-85f-d35-43f-16000-";

    if (MyNativeModule) {
      const result = await MyNativeModule?.processQRCode(qrData);
      console.log("result", result);
    } else {
      console.error("NativeModuleMy is null");
    }
  };

  const decodeQR = async () => {
    const token = await getUserToken();
    const user = await getUserData();
    console.log("token", token);
    const dObject = {
      authorization: token,
      input: {
        input_string:
          "252-252-252-252-252-252-252-252-252-252-252-252-252-252-f33-662-bff-bff-f33-935-e5b-9c-252-252-252-252-252-252-65d-886-abf-78c-abf-54e-92f-c05-b29-65d-886-c44-7fc-99e-cf-b98-bff-bff-bff-f7c-935-30-fcd-bff-bff-ea3-662-fcd-f33-32c-718-180-ef2-3bf-96c-4ae-a2b-9c2-252-252-252-252-886-f36-886-65d-dd1-3bc-8d0-886-886-886-886-c82-20e-4c2-c44-bb1-68d-581-16000-252-252-252-252-252-252-252-252-252-252-252-252-252-252-886-c05-65d-c05-c05-312-ff4-a9e-252-252-252-252-252-252-252-252-bff-fcd-935-f33-b0-84d-fb3-ff4-edc-fe6-a7a-4a1-fe7-668-252-252-252-252-252-252-252-252-bff-fcd-935-bff-b0-84d-fb3-ff4-edc-fe6-a7a-4a1-ff4-86e-16000-",
      },
    };

    const encodedData = btoa(JSON.stringify(dObject));
    console.log("encodedData", encodedData);
    const response = await fetch(
      `https://hum.ujn.mybluehostin.me/span/v1/qr_decode.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: encodedData }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("responseresponse", response);
    const result = await response.json();
    console.log("resultresult.....", result);
  };

  useEffect(() => {
    requestPermission();
    decodeQR();
  }, []);

  return (
    <>
      <CameraView
        style={styles.camera}
        facing={"back"}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(scanningResult) => {
          onScanResult();
        }}
      >
        <>
          <View
            style={{
              borderWidth: 1,
              borderColor: GlobalAppColor.White,
              opacity: 0.5,
              borderRadius: 6,
              marginHorizontal: 49,
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 130,
              flex: 1,
            }}
          >
            <ActivityIndicator size={"large"} color={GlobalAppColor.White} />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                goBack();
              }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 16, color: GlobalAppColor.White },
                ]}
              >
                Back
              </Text>
            </Pressable>
          </View>
          {/* Remove it after Testing */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                onScanResult();
              }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 16, color: GlobalAppColor.White },
                ]}
              >
                Back
              </Text>
            </Pressable>
          </View>
        </>
      </CameraView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    display: "flex",
    height: 48,
    width: "auto",
    backgroundColor: "#0A509C",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 32,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  pressed: {
    backgroundColor: "#083D75",
  },
});
