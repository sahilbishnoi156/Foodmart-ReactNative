import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import products from "@/assets/data/products";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import AddToCartButton from "@/src/components/Button";
import { useCart } from "@/src/providers/CartProvider";

const sizes = ["S", "M", "L", "XL"];

const ProductDetailScreen = () => {
  const props = useLocalSearchParams();
  const product = products.find(({ id }) => id.toString() === props.id);

  const [selectedSize, setSelectedSize] = React.useState<
    "S" | "M" | "L" | "XL"
  >("S");
  const { addItem } = useCart();

  const addToCart = () => {
    if(!product) return;
    addItem(product, selectedSize);
    router.push('/cart')
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
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
      <Text style={styles.price}>Price: ${product.price}</Text>
      <AddToCartButton onPress={addToCart} text="Add to cart" />
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
