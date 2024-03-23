import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import products from "@/assets/data/products";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";


const ProductDetailScreen = () => {
  const props = useLocalSearchParams();
  const product = products.find(({ id }) => id.toString() === props.id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => {
            return (
              <Link href={`/(admin)/menu/create?id=${props.id}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="pencil"
                      size={24}
                      color={Colors.light.tint}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            );
          },
        }}
      />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Price: ${product.price}</Text>
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
  title:{
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  price: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});
