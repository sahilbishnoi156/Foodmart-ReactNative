import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useCart } from "@/src/providers/CartProvider";
import { CartItem } from "@/src/types";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import Colors from "@/src/constants/Colors";
import RemoteImage from "../Orders/RemoteImage";

type CartListItemProps = {
  cartItem: CartItem;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
  const { updateQuantity } = useCart();
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <RemoteImage
          path={cartItem.product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{cartItem.product.name}</Text>
          <Text style={styles.subTitle}>{cartItem.product.name}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <View>
          <Text style={styles.leftSideSize}>Size: {cartItem.size}</Text>
          <Text style={styles.leftSidePrice}>
            ₹{cartItem.product.price.toFixed(2)} x {cartItem.quantity}
          </Text>
        </View>
        <View style={styles.rightSideContainer}>
          <View style={styles.quantitySelector}>
            <FontAwesome
              onPress={() => updateQuantity(cartItem.id, -1)}
              name="minus"
              color="gray"
              size={15}
              style={{ padding: 5 }}
            />

            <Text style={styles.quantity}>{cartItem.quantity}</Text>
            <FontAwesome
              onPress={() => updateQuantity(cartItem.id, 1)}
              name="plus"
              size={15}
              color="gray"
              style={{ padding: 5 }}
            />
          </View>
          <Text style={styles.rightSidePrice}>
            ₹{cartItem.product.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 15,
    flex: 1,
  },
  image: {
    width: 80,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
  },
  subTitle: {
    fontWeight: "200",
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  //! Container styles
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightSideContainer: {
    alignItems: "center",
    justifyContent: 'flex-start'
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  quantity: {
    fontWeight: "500",
    fontSize: 20,
  },
  leftSidePrice: {
    color: "gray",
  },
  leftSideSize: {
    fontWeight: "400",
    fontSize: 16,
  },
  rightSidePrice: {
    color: "black",
    fontWeight: "500",
  },
});

export default CartListItem;
