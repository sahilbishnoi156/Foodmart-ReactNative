// import { useOrderDetails } from '@/api/orders';
import orders from "@/assets/data/orders";
import { useOrderDetails } from "@/src/api/orders";
import { useUpdateOrderSubscription } from "@/src/api/orders/subscriptions";
import OrderItemListItem from "@/src/components/Orders/OrderItemListItem";
import OrderListItem from "@/src/components/Orders/OrderListItem";
import Colors from "@/src/constants/Colors";
import { Button } from "@rneui/themed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  //! Custom Hooks
  const { data: order, isLoading, error } = useOrderDetails(id);
  const router = useRouter();

  //! Real time updation
  useUpdateOrderSubscription(id);
  
  //! Total Price of items
  const totalPrice = order?.order_items.reduce(
    (total, item) => (total += (item?.products?.price || 0) * item.quantity),
    0
  );

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
  if (error || !order) {
    return (
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Stack.Screen options={{ title: "Invalid Order" }} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Order Not Found
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
        ListFooterComponent={()=>{
          return <Text style={styles.price}>Total: ₹{totalPrice}</Text>
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemsHeading: {
    fontSize: 17,
    fontWeight: "500",
    marginTop: 15,
  },
  otherContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
  },
});
