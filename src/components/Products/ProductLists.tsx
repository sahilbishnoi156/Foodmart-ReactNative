import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import ProductListItem from "./ProductListItem";
import useProductList from "@/src/api/products";
import { Button, Skeleton } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductLists() {
  const { data: products, isLoading, error } = useProductList();
  const [refreshing, setRefreshing] = React.useState(false);
  const queryClient = useQueryClient();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Something Went Wrong
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {products?.length === 0 && (
        <Text style={styles.noProdText}>No Products Available</Text>
      )}
      <FlatList
        data={products}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) =>
          refreshing ? (
            <Skeleton animation="pulse" height={230} style={styles.skeleton} />
          ) : (
            <ProductListItem product={item} />
          )
        }
        numColumns={2}
        contentContainerStyle={{ gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 10,
  },
  noProdText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
