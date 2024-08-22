import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HomeStyle } from "../Home/style";
import { GlobalAppColor } from "../../CONST";
import { RenderInvoiceItem } from "../Home/components/HomeView/RenderInvoiceItem";
import { CustomTextInput } from "../../components/CustomTextInput";
import { Fontisto } from "@expo/vector-icons";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import {
  convertDateFormat,
  debounce,
  getUserData,
  getUserToken,
} from "../../utils";
import { MachineRecord } from "../../type";
import { btoa, atob } from "react-native-quick-base64";
import { CheckBox } from "react-native-elements";

export const License = () => {
  const [invoiceData, setInvoiceData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(invoiceData);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = React.useState("");
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const data = [
    { key: "1", value: "Mobiles", disabled: true },
    { key: "2", value: "Appliances" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers", disabled: true },
    { key: "5", value: "Vegetables" },
    { key: "6", value: "Diary Products" },
    { key: "7", value: "Drinks" },
  ];
  const fetchLicensesDebounced = useCallback(
    debounce((text: string) => {
      fetchLicenses(text);
    }, 5000),
    []
  );
  const fetchLicenses = async (searchText: string) => {
    const token = await getUserToken();
    const user = await getUserData();

    const dObject = {
      authorization: token,
      input: {
        tab_id: "",
        offset: "0",
        limit: "10",
        uid: user?.data.user_id,
        utype: user?.data.user_type,
        text: searchText ?? "",
        filter: [""],
      },
    };

    const encodedData = btoa(JSON.stringify(dObject));
    const finalData = { data: encodedData };

    const response = await fetch(
      "https://hum.ujn.mybluehostin.me/span/v1/filter_product.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      }
    );
    const result = await response.json();
    console.log("result", result?.data);
    const invoiceData = result.data?.map((product: MachineRecord) => {
      return {
        key: product.id,
        colors:
          product.status == "0"
            ? ["rgba(0, 128, 0, 0.3)", "rgba(255, 255, 255, 0.3)"]
            : ["rgba(10, 80, 156, 0.3)", "rgba(255, 255, 255, 0.3)"],
        borderColor: "#BEC3CC",
        statusColor: GlobalAppColor.APPRED,
        companyName: product.company_name,
        location: `(${product.location})`,
        status: product.status == "1" ? "Approved" : "Pending",
        invoiceNo: product.invoice_number,
        date: convertDateFormat(product.created_on),
        id: product.id,
      };
    });

    if (invoiceData) {
      setInvoiceData(invoiceData);
    }
  };

  useEffect(() => {
    setFilteredData(
      invoiceData?.filter(
        (item) =>
          item?.companyName
            ?.toLowerCase()
            ?.includes(searchText.toLowerCase()) ||
          item?.invoiceNo?.toLowerCase()?.includes(searchText.toLowerCase()) ||
          item?.location?.toLowerCase()?.includes(searchText.toLowerCase()) ||
          item?.status?.toLowerCase()?.includes(searchText.toLowerCase())
      )
    );
  }, [searchText, invoiceData]);

  useEffect(() => {
    fetchLicensesDebounced(searchText);
  }, [searchText, fetchLicensesDebounced]);

  return (
    <SafeAreaView style={{ display: "flex", flex: 1, flexDirection: "column" }}>
      <View
        style={{
          marginHorizontal: 25,
          marginTop: 28,
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          columnGap: 8,
        }}
      >
        <CustomTextInput
          inputType="Text"
          inputContainerStyle={{
            backgroundColor: GlobalAppColor.AppWhite,
            flex: 1,
          }}
          placeholder="Search..."
          onChangeText={(text) => {
            setSearchText(text);
          }}
        />
        <Pressable
          onPress={toggleModal}
          style={{
            width: 42,
            height: 42,
            borderColor: "#BEC3CC",
            borderWidth: 1,
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <Image
            source={require("../../assets/filterIcon.png")}
            style={{ width: 32, height: 32 }}
          />
        </Pressable>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          rowGap: 31,
          marginTop: 35,
          flex: 1,
        }}
      >
        <FlashList
          data={filteredData}
          renderItem={RenderInvoiceItem}
          keyExtractor={(item) => item.key}
          ItemSeparatorComponent={SeparatorComponent}
          estimatedItemSize={100}
        />
      </View>
    </SafeAreaView>
  );
};

const SeparatorComponent = () => <View style={{ height: 20 }} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    marginTop: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
