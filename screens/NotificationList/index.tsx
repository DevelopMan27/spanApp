import { Platform, ScrollView, Text, View } from "react-native";
import { GlobalStyle } from "../../CONST";

export const NotificationList = () => {
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#0000000F",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 14,
    },
    android: {
      elevation: 10, // You may need to adjust this value to get a similar effect
    },
  });
  return (
    <ScrollView
      style={{
        marginLeft: 25,
        marginTop: 25,
        marginRight: 25,
      }}
      contentContainerStyle={{
        display: "flex",
        flexDirection: "column",
        rowGap: 20,
      }}
    >
      <View
        style={[
          {
            padding: 13,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: "#BEC3CC",
          },
          shadowStyle,
        ]}
      >
        <Text
          style={
            (GlobalStyle.TextStyle600_20_27, { fontSize: 14, lineHeight: 19 })
          }
        >
          TORRENT PHARMA
          <Text style={{ color: "#000000CC" }}>
            {" "}
            Licence has been Approved By Mr Anil Siddhapura
          </Text>
        </Text>
      </View>
      <View
        style={[
          {
            padding: 13,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: "#BEC3CC",
          },
          shadowStyle,
        ]}
      >
        <Text
          style={
            (GlobalStyle.TextStyle600_20_27, { fontSize: 14, lineHeight: 19 })
          }
        >
          TORRENT PHARMA
          <Text style={{ color: "#000000CC" }}>
            {" "}
            Licence has been Approved By Mr Anil Siddhapura
          </Text>
        </Text>
      </View>
      <View
        style={[
          {
            padding: 13,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: "#BEC3CC",
          },
          shadowStyle,
        ]}
      >
        <Text
          style={
            (GlobalStyle.TextStyle600_20_27, { fontSize: 14, lineHeight: 19 })
          }
        >
          TORRENT PHARMA
          <Text style={{ color: "#000000CC" }}>
            {" "}
            Licence has been Approved By Mr Anil Siddhapura
          </Text>
        </Text>
      </View>
      <View
        style={[
          {
            padding: 13,
            borderWidth: 1,
            borderRadius: 6,
            borderColor: "#BEC3CC",
          },
          shadowStyle,
        ]}
      >
        <Text
          style={
            (GlobalStyle.TextStyle600_20_27, { fontSize: 14, lineHeight: 19 })
          }
        >
          TORRENT PHARMA
          <Text style={{ color: "#000000CC" }}>
            {" "}
            Licence has been Approved By Mr Anil Siddhapura
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};
