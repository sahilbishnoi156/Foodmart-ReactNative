import React from "react";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { useCart } from "@/src/providers/CartProvider";
import { Badge } from "@rneui/base";
import { useAuth } from "@/src/providers/AuthProvider";

export default function MenuStack() {
  const { items } = useCart();
  const { isAdmin } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerRight: () => {
          return (
            <>
              {isAdmin === true && (
                <Link href="/" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        name="home"
                        size={24}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              )}
              <Badge
                value={items.length}
                textStyle={{ paddingBottom: 1 }}
                containerStyle={{
                  position: "absolute",
                  zIndex: 2,
                  top: 0,
                  right: 0,
                }}
              />
              <Link href="/cart" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="shopping-cart"
                      size={24}
                      color={Colors.light.tint}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </>
          );
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menu" }} />
    </Stack>
  );
}
