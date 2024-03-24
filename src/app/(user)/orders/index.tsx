import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserOrderList } from "@/src/api/orders";
import { Skeleton } from "@rneui/themed";
import OrderListItem from "@/src/components/Orders/OrderListItem";
import { useAuth } from "@/src/providers/AuthProvider";
import { Stack } from "expo-router";
import { useUpdateOrderSubscription } from "@/src/api/orders/subscriptions";

const UserOrders = () => {
  const { data: orders, isLoading, error } = useUserOrderList();
  const { session } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);
  const queryClient = useQueryClient();
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["orders", { userId: session?.user?.id }],
    });
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <Stack.Screen options={{title:"Loading Orders"}}/>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error || !orders) {
    return (
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Stack.Screen options={{title:"My Orders"}}/>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Something Went Wrong
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Stack.Screen options={{title:"My Orders"}}/>
      {orders.length === 0 && (
        <Text style={styles.noOrders}>No Orders Yet</Text>
      )}
      <FlatList
        data={orders}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) =>
          refreshing ? (
            <Skeleton animation="pulse" height={60} style={styles.skeleton} />
          ) : (
            <OrderListItem order={item} />
          )
        }
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />
    </View>
  );
};

export default UserOrders;

const styles = StyleSheet.create({
  noOrders: {
    fontSize: 20,
    fontWeight: "500",
  },
  skeleton: {
    borderRadius: 10,
    flex: 1,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
