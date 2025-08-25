import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import BottomNav from "../../components/BottomNav";
import { useRouter } from "expo-router";

const OrderItem = ({ id }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/tracking/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.left}>
          <Image
            source={require("../../assets/icons/box.png")}
            style={styles.icon}
          />
          <View>
            <Text style={styles.orderId}>{id}</Text>
            <Text style={styles.orderStatus}>On the way to delivery</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.badgeText}>On process</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Orders() {
  const [activeTab, setActiveTab] = useState("fromMe");
  const [searchText, setSearchText] = useState("");

  // Tabs Config
  const tabs = [
    { key: "fromMe", label: "From Me" },
    { key: "toMe", label: "To Me" },
  ];

  // Sample order data
  const allOrders = [
    { id: "VK3728732" },
    { id: "AB1234567" },
    { id: "XY9999999" },
    { id: "VK3728732" },
    { id: "LM1010101" },
    { id: "VK3728732" },
  ];

  const filteredOrders = allOrders.filter((order) =>
    order.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const isSearching = searchText.trim().length > 0;

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>My Order</Text>

        {/* Search */}
        <View style={styles.searchBox}>
          <Image
            source={require("../../assets/icons/search1.png")}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Enter Track ID Number"
            style={styles.searchInput}
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Image
            source={require("../../assets/icons/sort.png")}
            style={styles.filterIcon}
          />
        </View>

        {/* Show tabs only if not searching */}
        {!isSearching && (
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabWrapper}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
                {activeTab === tab.key && <View style={styles.underline} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* If searching, show result text */}
        {isSearching && (
          <Text style={styles.resultsText}>
            Results for{" "}
            <Text style={{ color: "#6C63FF" }}>{searchText}</Text>
          </Text>
        )}

        {/* Orders List */}
        {filteredOrders.map((order, i) => (
          <OrderItem key={i} id={order.id} />
        ))}

        {/* Optional: No results */}
        {isSearching && filteredOrders.length === 0 && (
          <Text style={styles.noResults}>No matching orders found.</Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav activeTab="My Orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  container: {
    padding: 20,
    paddingBottom: 0,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#39335E",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    resizeMode: "contain",
    tintColor: "#888",
  },
  filterIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
    resizeMode: "contain",
    tintColor: "#888",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabWrapper: {
    width: "50%",
    alignItems: "center",
  },
  tabText: {
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },
  activeTabText: {
    color: "#6C63FF",
  },
  underline: {
    marginTop: 4,
    height: 2,
    width: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 2,
  },
  card: {
    backgroundColor: "#F8F7FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 38,
    height: 38,
    marginRight: 10,
    resizeMode: "contain",
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#39335E",
  },
  orderStatus: {
    fontSize: 12,
    color: "#888",
  },
  statusBadge: {
    backgroundColor: "#D4F8E8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: "#1BA672",
    fontSize: 12,
    fontWeight: "600",
  },
  resultsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#39335E",
    marginBottom: 10,
  },
  noResults: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 14,
  },
});
