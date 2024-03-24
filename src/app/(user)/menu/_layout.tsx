import React from "react";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { Icon } from "@rneui/themed";
import { supabase } from "@/src/lib/supabase";

export default function MenuStack() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => {
          return (
            <>
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
              <Icon name="logout" onPress={()=>supabase.auth.signOut()}/>
            </>
          );
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Menu" }} />
    </Stack>
  );
}
