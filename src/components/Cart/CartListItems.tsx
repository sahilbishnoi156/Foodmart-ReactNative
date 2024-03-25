import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useCart } from "@/src/providers/CartProvider";
import CartListItem from "./CartListItem";
import { router } from "expo-router";
import { Button } from "@rneui/themed";

const CartListItems = () => {
  const { items, total, checkout, isCheckingOut } = useCart();
  return (
    <View>
      {items.length === 0 && (
        <Text style={styles.emptyCartText}>Cart is empty</Text>
      )}
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
      <Text>Total Price : ${total}</Text>
      {items.length === 0 ? (
        <Button
          title="Buy Food"
          onPress={() => {
            router.push("/(user)/menu/");
          }}
          containerStyle={{ marginTop: 10 }}
          radius={12}
        />
      ) : (
        <Button
          loading={isCheckingOut}
          title="CheckOut"
          onPress={checkout}
          containerStyle={{ marginTop: 10 }}
          radius={12}
        />
      )}
    </View>
  );
};

export default CartListItems;

const styles = StyleSheet.create({
  emptyCartText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
