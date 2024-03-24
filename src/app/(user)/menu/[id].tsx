import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import { useCart } from "@/src/providers/CartProvider";
import { useProduct } from "@/src/api/products";
import { PizzaSize } from "@/src/types";
import { Button } from "@rneui/themed";
import Colors from "@/src/constants/Colors";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  //! Custom Hook
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem, items } = useCart();
  
  //! Local States
  const [selectedSize, setSelectedSize] = React.useState<PizzaSize>("S");
  const isAlreadyAdded = items.find((item) => (item.product_id === id) && item.size === selectedSize);

  //! Add To Cart Function
  const handleCartButtonClick = () => {
    if (!product) return; 
    if(!isAlreadyAdded) addItem(product, selectedSize);
    router.push("/cart");
  };

  //! If product is loading
  if (isLoading) {
    return (
      <View style={styles.otherContainer}>
        <Stack.Screen options={{ title: "Loading" }} />
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  //! If there is an error
  if (error || !product) {
    return (
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Stack.Screen options={{ title: "Invalid Product" }} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Product Not Found
        </Text>
        <Button
          onPress={() => router.back()}
          radius={12}
          raised
          size="lg"
          containerStyle={{ marginTop: 10 }}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }} />
      <Image
        source={{ uri: product?.image || defaultPizzaImage }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text>Select size</Text>
      <View style={styles.productSizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size as "S" | "M" | "L" | "XL")}
            key={size}
            style={[
              styles.productSize,
              {
                backgroundColor: selectedSize === size ? "gainsboro" : "white",
              },
            ]}
          >
            <Text
              style={[
                styles.productSizeText,
                { color: selectedSize === size ? "black" : "grey" },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>Price: ${product?.price}</Text>
      <Button
        onPress={handleCartButtonClick}
        radius={14}
        raised
        size="lg"
        color={Colors.light.tint}
        containerStyle={{ marginTop: 20 }}
      >
        {isAlreadyAdded ? "Go to cart" : "Add to cart" }
      </Button>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  otherContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  productSizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  productSize: {
    borderRadius: 25,
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  productSizeText: {
    fontSize: 18,
    fontWeight: "400",
  },
  price: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});
