import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function CallScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const handleEndCall = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require("../../assets/icons/caller.png")}
        style={styles.backgroundImage}
      />

      {/* Overlay Content */}
      <View style={styles.overlay}>
        {/* Caller Name */}
        <Text style={styles.nameText}>{name || "Unknown Caller"}</Text>
        <Text style={styles.statusText}>Calling...</Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {/* End Call */}
          <TouchableOpacity
            style={[styles.callButton, { backgroundColor: "#FF5B5B" }]}
            onPress={handleEndCall}
          >
            <Image
              source={require("../../assets/icons/close1.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Mute Mic */}
          <TouchableOpacity
            style={[styles.callButton, { backgroundColor: "#34C759" }]}
          >
            <Image
              source={require("../../assets/icons/micc1.png")}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Speaker */}
          <TouchableOpacity
            style={[styles.callButton, { backgroundColor: "#FFA726" }]}
          >
            <Image
              source={require("../../assets/icons/Volume1.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    width: width,
    height: height,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: height * 0.1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  nameText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  statusText: {
    color: "#ddd",
    fontSize: 16,
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // shadow for android
    shadowColor: "#000", // shadow for ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
});
