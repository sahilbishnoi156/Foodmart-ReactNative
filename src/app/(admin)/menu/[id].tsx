import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { useDeleteProduct, useProduct } from "@/src/api/products";
import { Button, Icon } from "@rneui/base";
import { Image } from "@rneui/themed";
import RemoteImage from "@/src/components/Orders/RemoteImage";

const ProductDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  //! Local
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  //! Custom Hook
  const { data: product, isLoading, error } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  //! HandleDeleteProduct
  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      deleteProduct(id, {
        onSuccess: () => {
          router.back();
          setIsDeleting(false);
        },
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const confirmDeleteProduct = () => {
    Alert.alert("Confirm", "Are you sure want to delete this product?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: handleDeleteProduct },
    ]);
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
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => {
            return (
              <Link href={`/(admin)/menu/create?id=${id}`} asChild>
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
      <RemoteImage
        path={product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Price: ${product.price}</Text>

      <Button
        onPress={confirmDeleteProduct}
        color={"error"}
        radius={12}
        loading={isDeleting}
        raised
        size="lg"
        containerStyle={{ marginTop: 20 }}
      >
        <Icon name="delete" color="white" />
        Delete
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
  deleteSkeleton: {
    backgroundColor: "red",
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  deleteButton: {
    color: "red",
    alignSelf: "center",
    fontSize: 18,
    marginTop: 10,
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
  title: {
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
