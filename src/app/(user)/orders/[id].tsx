// import { useOrderDetails } from '@/api/orders';
import orders from "@/assets/data/orders";
import OrderItemListItem from "@/src/components/Orders/OrderItemListItem";
import OrderListItem from "@/src/components/Orders/OrderListItem";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const order = orders.find((orderItem) => orderItem.id === id);

  // const { data: order, isLoading, error } = useOrderDetails(id);
  // useUpdateOrderSubscription(id);

  // if (isLoading) {
  //   return <ActivityIndicator />;
  // }
  if (!order) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    <View style={{ padding: 10, gap: 20, flex: 1 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => {
          return (
            <>
              <OrderListItem order={order} />
              <Text style={styles.itemsHeading}>Purchaged Items</Text>
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemsHeading:{
    fontSize: 17,
    fontWeight: "500",
    marginTop: 15,
  }
})