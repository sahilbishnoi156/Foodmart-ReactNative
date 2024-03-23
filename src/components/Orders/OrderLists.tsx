import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "../Button";
import { router } from "expo-router";
import OrderListItem from "./OrderListItem";
import orders from "@/assets/data/orders";

const OrderLists = () => {
  return (
    <View>
      {orders.length === 0 && (
        <Text style={styles.noOrders}>No Orders Yet</Text>
      )}
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
    </View>
  );
};

export default OrderLists;

const styles = StyleSheet.create({
  noOrders: {
    fontSize: 20,
    fontWeight: "500",
  },
});
