import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GlobalAppColor, GlobalStyle } from "../../../../CONST";
import SystemOption from "./SystemOption";
import React, { useEffect, useState } from "react";
import { makeRemote } from "react-native-reanimated/lib/typescript/reanimated2/mutables";
import { useNavigation } from "@react-navigation/native";
import { useBottomSheetContext } from "../../../../contexts/BottomSheetContext";
import { getUserData, getUserToken } from "../../../../utils";
import { btoa, atob } from "react-native-quick-base64";

export const AdminBottomSheetChild = () => {
  const { navigate } = useNavigation();
  const {
    openQRScanBottomSheetFun,
    openSelectAdminBottomSheetFun,
    closeSelectAdminBottomSheetFun,
  } = useBottomSheetContext();
  const [systemType, setSystemType] = useState<
    "Admin1" | "Admin2" | "Admin3" | "Admin4" | "Admin5" | "Admin6" | undefined
  >(undefined);

  const [options, setOptions] = useState([]);

  const getAdminUserList = async () => {
    const token = await getUserToken();
    const userData = await getUserData();
    const dObject = {
      authorization: token,
      input: {
        id: userData?.id,
      },
    };

    const encodedData = btoa(JSON.stringify(dObject));
    const finalData = { data: encodedData };

    const response = await fetch(
      "https://hum.ujn.mybluehostin.me/span/v1/master.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      }
    );
    const result = await response.json();
    const adminList = result?.data?.additional_data?.admins?.map((admin) => {
      return {
        label: admin.username,
        value: admin.id,
      };
    });
    if (adminList) {
      setOptions(adminList);
    }
  };

  useEffect(() => {
    getAdminUserList();
  }, []);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            display: "flex",
            flexDirection: "column",
          },
        ]}
      >
        <Text style={[GlobalStyle.TextStyle600_20_27, { alignSelf: "center" }]}>
          Select Admin
        </Text>
        <View style={{ display: "flex", height: "80%" }}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ marginTop: 29 }}>
                <SystemOption
                  label={item.label}
                  selected={systemType === item.value}
                  onPress={() => setSystemType(item.value)}
                />
              </View>
            )}
          />
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 25,
          display: "flex",
          flex: 1,
          width: "100%",
          paddingHorizontal: 28,
        }}
      >
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() => {
            closeSelectAdminBottomSheetFun();
            navigate("QRScan");
          }}
        >
          <Text
            style={[
              GlobalStyle.TextStyle500_25_16,
              { fontSize: 16, color: GlobalAppColor.White },
            ]}
          >
            Next
          </Text>
        </Pressable>
      </View>
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
