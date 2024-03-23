import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import { ProductType } from "@/src/types";
import { Link, useSegments } from "expo-router";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";

type ProductListItemProps = {
  product: ProductType;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();
  return (
    <Link href={`/${segments[0] as "(user)" | "(admin)"}/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaImage }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
