import { useOrderDetails, useUpdateOrder } from "@/src/api/orders";
// import { notifyUserAboutOrderUpdate } from '@/lib/notifications';
import OrderItemListItem from "@/src/components/Orders/OrderItemListItem";
import OrderListItem from "@/src/components/Orders/OrderListItem";
import Colors from "@/src/constants/Colors";
import { notifyUserAboutOrderUpdate } from "@/src/lib/notifications";
import { OrderStatusList } from "@/src/types";
import { Button } from "@rneui/themed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  //! Custom Hooks
  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  //! Local States
  const [isUpdating, setIsUpdating] = React.useState(false);
  const router = useRouter();
  const totalPrice = order?.order_items.reduce(
    (total, item) => (total += (item?.products?.price || 0) * item.quantity),
    0
  );

  //! Update Status
  const updateStatus = async (status: string) => {
    setIsUpdating(true);
    updateOrder(
      {
        id: id,
        updatedFields: { status },
      },
      {
        onSuccess: async () => {
          if (order) {
            await notifyUserAboutOrderUpdate({ ...order, status });
          }
          setIsUpdating(false);
        },
      }
    );
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
      <Stack.Screen
        options={{
          title: `Order #${id}`,
          headerRight: () => {
            if (isUpdating) {
              return <ActivityIndicator color={"black"} />;
            }else{
              return <></>
            }
          },
        }}
      />
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => (
          <>
            <OrderListItem order={order} />
            <Text style={styles.itemsHeading}>Purchaged Items</Text>
          </>
        )}
        ListFooterComponent={() => (
          <>
            <Text style={styles.price}>Total Price: ₹{totalPrice}</Text>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                paddingBottom: 20,
                paddingTop: 5,
              }}
            >
              {OrderStatusList.map((status) => (
                <Button
                  title={status}
                  type={order.status === status ? "solid" : "outline"}
                  radius={8}
                  disabled={isUpdating}
                  key={status}
                  onPress={() => updateStatus(status)}
                />
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  otherContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsHeading: {
    fontSize: 17,
    fontWeight: "500",
    marginTop: 15,
  },
  price: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.tint,
  },
});
