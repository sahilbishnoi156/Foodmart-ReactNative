import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import Colors from "@/src/constants/Colors";
import { Tables } from "@/src/types";
import { Link, useSegments } from "expo-router";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import { Image, Skeleton } from "@rneui/themed";
import RemoteImage from "../Orders/RemoteImage";

type ProductListItemProps = {
  product: Tables<"products">;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();
  return (
    <Link
      href={`/${segments[0] as "(user)" | "(admin)"}/menu/${product.id}`}
      asChild
    >
      <Pressable style={styles.container}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
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
    fontSize: 19,
    fontWeight: "500",
  },
  price: {
    color: 'black',
    fontSize: 16,
  },
});
