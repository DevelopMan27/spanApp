import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GlobalAppColor, GlobalFont, GlobalStyle } from "../../CONST";
import { CustomTextInput } from "../../components/CustomTextInput";
import React, { useEffect, useState } from "react";
import { PopUpModal } from "../../components/PopUp";
import { getUserData, getUserToken } from "../../utils";
import { btoa, atob } from "react-native-quick-base64";
import * as Yup from "yup";
import { useFormik } from "formik";

export const DeviceDetails = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const DeviceSchema = Yup.object().shape({
    invoiceNumber: Yup.string(),
    purchaseNumber: Yup.string(),
    modelNumber: Yup.string(),
    companyName: Yup.string(),
    companyLocation: Yup.string(),
    serviceTag: Yup.string(),
    serviceNo: Yup.string(),
    ioServiceNo: Yup.string(),
  });

  const formik = useFormik({
    validationSchema: DeviceSchema,
    initialValues: {},
    onSubmit: async (values) => {
      //   checkUser();
      console.log("values", values);

      // signInWithPhoneNumber(values.mobile);
    },
  });

  const createProduct = async () => {
    const token = await getUserToken();
    const userData = await getUserData();
    const dObject = {
      authorization: token,
      input: {
        p_index: "18", // Assuming this is an array data
        qr_string:
          "252-252-252-252-252-252-5c6-16a-a2-312-da5-cee-718-668-718-910-65d-886-886-886-c05-c82-62-a74-bb1-bb1-668-a32-c90-86e-340-e2a-252-252-252-252-bff-bff-9ec-32c-581-a90-ef2-e59-884-1c5-a2b-229-65d-f36-886-886-dd1-3bc-8d0-886-886-312-a9e-e4b-58a-439-58a-bb1-2",
        invoice_number: "SI50332021$1 0025385501B08F$1 K116251092", // This will be dynamically assigned based on condition
        purchase_number: "4800035873",
        machine_name: "Blister 1",
        model_number: "243-1000311",
        company_name: "TORRENT PHARMACEUTICAL LTD Test Company",
        ipc_service_tag: "ASSEMBLED CPU\r\n1000310",
        io_service_number: "BECKHOFF CX8190\r\nEL1018\r\nEL2809\r\n52-OD-F8",
        lens_info: "",
        setup_version: "03.1.0.1",
        engineer_id: "2",
        qc_id: "2",
        remark: "3D-CAMERA VEXG-13M 700005293101, LM16SC",
        key: "013330 - 00a9fb - 009320 - 007201",
        in_house_flag: "0",
        location: "Surat",
        barcode: "",
        two_d_code: "",
        changed_json: "null",
        uni_casting_admin: null,
        camera_serial_number: null, // json data
      },
    };

    const encodedData = btoa(JSON.stringify(dObject));
    const finalData = { data: encodedData };

    const response = await fetch(
      "https://hum.ujn.mybluehostin.me/span/v1/addproduct.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      }
    );
    const result = await response.json();
    console.log("===", result);
  };

  useEffect(() => {
    createProduct();
  }, []);
  return (
    <>
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginHorizontal: 26,
            marginVertical: 23,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 13,
              flex: 1,
            }}
          >
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Invoice Number :
              </Text>
              <CustomTextInput
                inputType="Text"
                placeholder="Enter Invoice No"
                // value={formik.values.}
                onChangeText={(text) => {
                  formik.setFieldValue("mobile", text);
                }}
              />
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Purchase Number:
              </Text>
              <CustomTextInput
                inputType="Text"
                placeholder="Enter Purchase No"
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 5,
              }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Model Number:
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  columnGap: 7,
                  // flex: 1,
                }}
              >
                <View style={{ width: "auto", display: "flex", flex: 1 / 2 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="SD232KF"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.AppWhite,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
                <View style={{ width: "auto", display: "flex", flex: 1 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="Enter Purchase No"
                  />
                </View>
              </View>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Company Info:
              </Text>
              <View
                style={{ display: "flex", flexDirection: "column", rowGap: 8 }}
              >
                <CustomTextInput
                  inputType="Text"
                  placeholder="Enter Company Name"
                  inputContainerStyle={{
                    backgroundColor: GlobalAppColor.AppWhite,
                  }}
                />
                <CustomTextInput
                  inputType="Text"
                  placeholder="Enter Company Location"
                  inputContainerStyle={{
                    backgroundColor: GlobalAppColor.AppWhite,
                  }}
                />
              </View>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Computer Info:
              </Text>
              <View
                style={{ display: "flex", flexDirection: "column", rowGap: 8 }}
              >
                <CustomTextInput
                  inputType="Text"
                  placeholder="Beckhoff CPU C6930-0040"
                  inputContainerStyle={{
                    backgroundColor: GlobalAppColor.AppWhite,
                  }}
                />
                <CustomTextInput
                  inputType="Text"
                  placeholder="Enter Service No"
                  inputContainerStyle={{
                    backgroundColor: GlobalAppColor.AppWhite,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 5,
              }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                I/O Info:
              </Text>
              <CustomTextInput
                inputType="Text"
                placeholder="Beckhoff CPU C6930-0040"
                inputContainerStyle={{
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  columnGap: 7,
                  // flex: 1,
                }}
              >
                <View style={{ width: "auto", display: "flex", flex: 1 / 2 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="SD232KF"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.InputBackGround,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
                <View style={{ width: "auto", display: "flex", flex: 1 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="EL1018"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.AppWhite,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  columnGap: 7,
                  // flex: 1,
                }}
              >
                <View style={{ width: "auto", display: "flex", flex: 1 / 2 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="OUTPUT"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.InputBackGround,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
                <View style={{ width: "auto", display: "flex", flex: 1 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="EL2809"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.AppWhite,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  columnGap: 7,
                  // flex: 1,
                }}
              >
                <View style={{ width: "auto", display: "flex", flex: 1 / 2 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="MAC ID"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.InputBackGround,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
                <View style={{ width: "auto", display: "flex", flex: 1 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="Enter Mac ID "
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.AppWhite,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 5,
              }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Camera Info:
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  columnGap: 7,
                  // flex: 1,
                }}
              >
                <View style={{ width: "auto", display: "flex", flex: 1 / 2 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="CAMERA 1"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.InputBackGround,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
                <View style={{ width: "auto", display: "flex", flex: 1 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="2635276838"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.AppWhite,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
              </View>
              <CustomTextInput
                inputType="Text"
                placeholder="Select Camera"
                inputContainerStyle={{
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
              />
              <CustomTextInput
                inputType="Text"
                placeholder="Select Lens"
                inputContainerStyle={{
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  columnGap: 7,
                  // flex: 1,
                }}
              >
                <View style={{ width: "auto", display: "flex", flex: 1 / 2 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="CAMERA 2"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.InputBackGround,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
                <View style={{ width: "auto", display: "flex", flex: 1 }}>
                  <CustomTextInput
                    inputType="Text"
                    placeholder="2635276838"
                    inputContainerStyle={{
                      backgroundColor: GlobalAppColor.AppWhite,
                      borderColor: "#BEC3CC",
                    }}
                  />
                </View>
              </View>
              <CustomTextInput
                inputType="Text"
                placeholder="Select Camera"
                inputContainerStyle={{
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
              />
              <CustomTextInput
                inputType="Text"
                placeholder="Select Lens"
                inputContainerStyle={{
                  backgroundColor: GlobalAppColor.AppWhite,
                }}
              />
            </View>

            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Work Order:
              </Text>
              <View
                style={{ display: "flex", flexDirection: "column", rowGap: 8 }}
              >
                <CustomTextInput
                  inputType="Text"
                  placeholder="Enter Work Order"
                  inputContainerStyle={{
                    backgroundColor: GlobalAppColor.AppWhite,
                  }}
                />
              </View>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Setup Version:
              </Text>
              <View
                style={{ display: "flex", flexDirection: "column", rowGap: 8 }}
              >
                <CustomTextInput
                  inputType="Text"
                  placeholder="1.09.86.72"
                  inputContainerStyle={{
                    backgroundColor: GlobalAppColor.AppWhite,
                  }}
                />
              </View>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
            >
              <Text
                style={[
                  GlobalStyle.TextStyle500_25_16,
                  { fontSize: 14, lineHeight: 25 },
                ]}
              >
                Engineer Name:
              </Text>
              <View
                style={{ display: "flex", flexDirection: "column", rowGap: 8 }}
              >
                <CustomTextInput inputType="Text" placeholder="Amit Patel" />
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{ display: "flex", marginHorizontal: 26, marginBottom: 30 }}
        >
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text
              style={[
                GlobalStyle.TextStyle500_25_16,
                { fontSize: 16, color: GlobalAppColor.White },
              ]}
            >
              Submit
            </Text>
          </Pressable>
        </View>
      </View>
      {modalVisible && (
        <PopUpModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </>
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
