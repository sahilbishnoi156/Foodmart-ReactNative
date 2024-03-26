import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useCart } from "../providers/CartProvider";
import CartListItems from "../components/Cart/CartListItems";
import Button from "../components/Button";

const Cart = () => {
  return (
    <>
      <CartListItems />
      <StatusBar
        animated={true}
        backgroundColor="#61dafb"
      />
    </>
  );
};

export default Cart;

const styles = StyleSheet.create({
});
