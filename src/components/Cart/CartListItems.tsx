import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useCart } from "@/src/providers/CartProvider";
import CartListItem from "./CartListItem";
import Button from "../Button";
import { router } from "expo-router";

const CartListItems = () => {
  const { items, total } = useCart();
  return (
    <View>
      {items.length === 0 && (
        <Text style={styles.emptyCartText}>Nothing here</Text>
      )}
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
      <Text>Total : {total}</Text>
      {items.length === 0 ? (
        <Button text="Buy Food" onPress={() => {router.push('/menu/')}} />
      ) : (
        <Button text="CheckOut" onPress={() => {}} />
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
