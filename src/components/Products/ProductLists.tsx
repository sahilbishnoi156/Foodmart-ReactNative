import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import products from "@/assets/data/products";
import ProductListItem from "./ProductListItem";

export default function ProductLists() {
  return (
    <View>
      <FlatList
        data={products}
        renderItem={({item}) => <ProductListItem product={item} />}
        numColumns={2}
        contentContainerStyle={{gap: 10, padding: 10}}
        columnWrapperStyle={{gap: 10}}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
