import OrderLists from "@/src/components/Orders/OrderLists";
import { Stack } from "expo-router";
export default function MenuScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Orders" }} />
      <OrderLists />
    </>
  );
}
