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
import useAdminOrderList from "@/src/api/orders";
import { Skeleton } from "@rneui/themed";
import OrderListItem from "@/src/components/Orders/OrderListItem";
import { useInsertOrderSubscription } from "@/src/api/orders/subscriptions";

type OrderProps = {
  archived: boolean;
};

const OrderAdminLists = ({ archived }: OrderProps) => {
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: archived });

  //! Local States
  const [refreshing, setRefreshing] = React.useState(false);
  const queryClient = useQueryClient();

  //! Refresh Control FUnction
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    setRefreshing(false);
  }, []);

  //! Real time subscription
  useInsertOrderSubscription();

  //! If data is loading
  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
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
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Something Went Wrong
        </Text>
      </View>
    );
  }

  return (
    <View style={{padding: 10}}>
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
        ListEmptyComponent={()=> <Text style={styles.noOrders}>No Orders Yet</Text>}
        contentContainerStyle={{gap: 10 }}
      />
    </View>
  );
};

export default OrderAdminLists;

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
