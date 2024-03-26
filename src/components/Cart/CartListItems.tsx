import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useCart } from "@/src/providers/CartProvider";
import CartListItem from "./CartListItem";
import { router } from "expo-router";
import { Button } from "@rneui/themed";
import { Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";

const CartListItems = () => {
  const { items, total, checkout, isCheckingOut } = useCart();
  return (
    <View>
      <FlatList
        data={items}
        ListEmptyComponent={
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Cart is empty</Text>
            <Button
              title="Explore"
              size="lg"
              onPress={() => {
                router.push("/(user)/menu/");
              }}
              raised
              containerStyle={{ marginTop: 10 }}
              radius={12}
            />
          </View>
        }
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{
          padding: 20,
          gap: 10,
          paddingBottom: 90,
          height: items.length !== 0 ? "auto" : "100%",
        }}
        ListFooterComponent={
          <View>
            {items.length !== 0 && (
              <>
                <Text style={{ marginTop: 20, fontSize: 17 }}>Pricing</Text>
                <View style={styles.subTotalContainer}>
                  <View style={styles.showPriceContainer}>
                    <Text style={styles.commonText}>Subtotal: </Text>
                    <Text style={styles.commonText}>₹{total}</Text>
                  </View>
                  <View
                    style={{ height: 2, backgroundColor: "#e6e1e1" }}
                  ></View>
                  <View style={styles.showPriceContainer}>
                    <Text style={styles.commonText}>Grand Total: </Text>
                    <Text style={styles.commonText}>₹{total}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        }
      />
      {items.length !== 0 && (
        <Button
          loading={isCheckingOut}
          raised
          title={
            <View style={styles.buttonInnerTextContainer}>
              <Text style={styles.buttonText}>
                {items.length} items | ₹{total}
              </Text>
              <Text style={styles.buttonText}>Checkout</Text>
            </View>
          }
          onPress={checkout}
          size="lg"
          iconPosition="left"
          containerStyle={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 10,
            marginHorizontal: 20,
          }}
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
  commonText: {
    color: "black",
    fontSize: 15,
    fontWeight: "500",
  },
  subTotalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  showPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  buttonInnerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
