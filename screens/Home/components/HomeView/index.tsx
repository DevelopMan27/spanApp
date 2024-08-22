import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GlobalAppColor, GlobalStyle } from "../../../../CONST";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { DetailItem } from "./DetailedItem";
import { HomeStyle } from "../../style";
import { FlashList } from "@shopify/flash-list";
import { RenderInvoiceItem } from "./RenderInvoiceItem";
import BottomSheet from "../../../../components/BottomSheetComponent";
import { useBottomSheetContext } from "../../../../contexts/BottomSheetContext";
import { SystemTypeBottomSheetChild } from "./SystemTypeBottomSheetChild";
import { AdminBottomSheetChild } from "./AdminBottomSheetChild";
import { useEffect, useState } from "react";
import { DateModal } from "../../../../components/DateModal";
import {
  generateSPANMaintenanceUserPassword,
  generateSPANUserPassword,
} from "../../../../dailyPassowrd";
import { date } from "yup";
import { btoa, atob } from "react-native-quick-base64";
import {
  convertDateFormat,
  getData,
  getGreetingMessage,
  getUserData,
  getUserToken,
} from "../../../../utils";
import { MachineRecord } from "../../../../type";
import { useNavigation } from "@react-navigation/native";
import { RouteNames } from "../../../../navigation/routesNames";

export const HomeView = () => {
  const {
    refRBSheet,
    selectAdminBSheetRef,
    openSelectAdminBottomSheetFun,
    closeQRScanBottomSheetFun,
  } = useBottomSheetContext();
  const [name, setName] = useState("");
  const userData = async () => {
    const userDetails = await getUserData();
    if (userDetails) {
      setName(userDetails?.data?.user_name);
    }
  };
  const { navigate } = useNavigation();
  const greetingsWithName = `${getGreetingMessage()}, ${name}!`;
  const note = `Sales Team Meeting will be scheduled on next saturday at office.`;
  const [invoiceData, setInvoiceData] = useState([]);
  // const invoiceData = [
  //   {
  //     key: "1",
  //     colors: ["rgba(10, 80, 156, 0.3)", "rgba(255, 255, 255, 0.3)"],
  //     borderColor: "#BEC3CC",
  //     statusColor: GlobalAppColor.GREEN,
  //     companyName: "INTAS FARMA",
  //     location: "(AHMEDABAD)",
  //     status: "Approved",
  //     invoiceNo: "SSN2334",
  //     date: "21/01/2024",
  //   },
  //   {
  //     key: "2",
  //     colors: ["rgba(0, 128, 0, 0.3)", "rgba(255, 255, 255, 0.3)"],
  //     borderColor: "#BEC3CC",
  //     statusColor: GlobalAppColor.APPRED,
  //     companyName: "INTAS FARMA",
  //     location: "(AHMEDABAD)",
  //     status: "Approved",
  //     invoiceNo: "SSN2334",
  //     date: "21/01/2024",
  //   },
  //   {
  //     key: "3",
  //     colors: ["rgba(0, 128, 0, 0.3)", "rgba(255, 255, 255, 0.3)"],
  //     borderColor: "#BEC3CC",
  //     statusColor: GlobalAppColor.APPRED,
  //     companyName: "INTAS FARMA",
  //     location: "(AHMEDABAD)",
  //     status: "Approved",
  //     invoiceNo: "SSN2334",
  //     date: "21/01/2024",
  //   },
  // ];
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);
  const [todayLogin, setTodayLogin] = useState("");
  const [tomorrowLogin, setTomorrowLogin] = useState("");
  const [todayExit, setTodayExit] = useState("");
  const [tomorrowExit, setTomorrowExit] = useState("");
  const onPress = () => {
    closeQRScanBottomSheetFun();
    setTimeout(function () {
      openSelectAdminBottomSheetFun();
    }, 1000);
  };

  useEffect(() => {
    if (date) {
      const currentDate = new Date(date);
      const d = currentDate.getDate();
      const m = currentDate.getMonth();
      const y = currentDate.getFullYear();

      const nextDate = new Date(currentDate);
      nextDate.setDate(d + 1); // Move to the next day
      const nextD = nextDate.getDate();
      const nextM = nextDate.getMonth();
      const nextY = nextDate.getFullYear();

      const todayLoginValue = generateSPANUserPassword(d, m, y);
      const tomorrowLoginValue = generateSPANUserPassword(nextD, nextM, nextY);
      const todayExitValue = generateSPANMaintenanceUserPassword(d, m, y);
      const tomorrowExitValue = generateSPANMaintenanceUserPassword(
        nextD,
        nextM,
        nextY
      );

      setTodayLogin(todayLoginValue);
      setTomorrowLogin(tomorrowLoginValue);
      setTodayExit(todayExitValue);
      setTomorrowExit(tomorrowExitValue);
    }
  }, [date]);
  function getNextDay(date: Date) {
    // Step 1: Create a Date object from the given date
    let givenDate = new Date(date);

    // Step 2: Add one day to the date
    givenDate.setDate(givenDate.getDate() + 1);

    // Step 3: Format the new date using toLocaleDateString
    return new Date(givenDate);
  }
  const token = "";
  const dObject = {
    authorization: token,
    input: {
      mobile: "9723083820",
      username: "Meetcpatel",
      email: "meetcpatel906@gmail.com",
      designation: "User",
      fb_uid: "Firebase Uid",
    },
  };
  const encodedData = btoa(JSON.stringify(dObject));
  const finalData = { data: encodedData };
  // console.log("====finalData====", finalData);
  const getProductList = async () => {
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
    console.log("finalData", finalData);
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

    const invoiceData = result.data?.latest_products?.map(
      (product: MachineRecord) => {
        return {
          key: product.id,
          colors:
            product.status == "0"
              ? ["rgba(0, 128, 0, 0.3)", "rgba(255, 255, 255, 0.3)"]
              : ["rgba(10, 80, 156, 0.3)", "rgba(255, 255, 255, 0.3)"],
          borderColor: "#BEC3CC",
          statusColor:
            product.status == "1"
              ? GlobalAppColor.GREEN
              : GlobalAppColor.APPRED,
          companyName: product.company_name,
          location: `(${product.location})`,
          status: product.status == "1" ? "Approved" : "Pending",
          invoiceNo: product.invoice_number,
          date: convertDateFormat(product.created_on),
          id: product.id,
        };
      }
    );
    if (invoiceData) {
      setInvoiceData(invoiceData);
    }
  };

  useEffect(() => {
    userData();
    getProductList();
  }, []);

  return (
    <>
      <ScrollView
        style={HomeStyle.scrollViewStyle}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={HomeStyle.greetingsParent}>
          <Text
            style={[GlobalStyle.TextStyle500_25_16]}
            onPress={() => {
              refRBSheet?.current?.open();
            }}
          >
            {greetingsWithName}
          </Text>
          {note && (
            <Text
              style={[
                GlobalStyle.TextStyle500_25_16,
                {
                  color: GlobalAppColor.AppGrey,
                },
              ]}
            >
              {note}
            </Text>
          )}
        </View>

        <View style={HomeStyle.dailyPasswordParent}>
          <View style={HomeStyle.dailyPasswordHeader}>
            <MaterialCommunityIcons
              name="calendar-edit"
              size={24}
              color="black"
              style={{ opacity: 0.2 }}
              onPress={() => setShow(true)}
            />
            <Text
              style={[
                GlobalStyle.TextStyle700_20_25,
                { color: GlobalAppColor.AppBlue },
              ]}
            >
              Daily Password
            </Text>
            <MaterialIcons
              name="open-in-new"
              size={24}
              color="black"
              style={{ opacity: 0.2 }}
            />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              opacity: 0.1,
              marginTop: 14,
            }}
          ></View>
          <View style={{ marginTop: 15 }}>
            <DetailItem
              label={"Today"}
              value={new Date(date)?.toLocaleDateString()}
            />
            <DetailItem label={"User Name"} value={"Dummy123"} />
            <DetailItem label={"Login Password"} value={todayLogin} />
            <DetailItem label={"Exit Password"} value={todayExit} />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#000000",
              opacity: 0.1,
              marginTop: 14,
            }}
          ></View>
          <View style={{ marginTop: 15 }}>
            <DetailItem
              label={"Tomorrow"}
              value={getNextDay(date)?.toLocaleDateString()}
            />
            <DetailItem label={"User Name"} value={"Dummy123"} />
            <DetailItem label={"Login Password"} value={tomorrowLogin} />
            <DetailItem label={"Exit Password"} value={tomorrowExit} />
          </View>
        </View>

        <View style={HomeStyle.InVoiceItemParent}>
          <FlashList
            data={invoiceData}
            renderItem={RenderInvoiceItem}
            keyExtractor={(item) => item.key}
            ItemSeparatorComponent={SeparatorComponent}
            estimatedItemSize={100}
            ListFooterComponent={() => {
              return (
                <Text
                  onPress={() => {
                    navigate(RouteNames.License);
                  }}
                  style={[
                    GlobalStyle.TextStyle700_20_25,
                    {
                      display: "flex",
                      alignContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      textDecorationStyle: "solid",
                      textDecorationLine: "underline",
                      marginTop: 28,
                    },
                  ]}
                >
                  View More
                </Text>
              );
            }}
          />
        </View>
      </ScrollView>
      <BottomSheet bottomSheetRef={refRBSheet}>
        <SystemTypeBottomSheetChild onPress={onPress} />
      </BottomSheet>
      <BottomSheet height={511} bottomSheetRef={selectAdminBSheetRef}>
        <AdminBottomSheetChild />
      </BottomSheet>
      {show && (
        <DateModal
          date={date}
          setDate={setDate}
          modalVisible={show}
          setModalVisible={setShow}
        />
      )}
    </>
  );
};
const SeparatorComponent = () => <View style={{ height: 20 }} />;

export const styles = StyleSheet.create({
  systemOptionContainer: {
    paddingVertical: 13,
    paddingHorizontal: 19,
    backgroundColor: "#EDF4FF",
    borderWidth: 1,
    borderColor: "#BEC3CC",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionPart1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    columnGap: 15,
  },
  selectionCircle: {
    width: 24,
    height: 24,
    backgroundColor: "#D2D2D2",
    borderRadius: 100,
  },
});
