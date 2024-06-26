import React from "react";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";

export default function MenuStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Menu (Admin)",
          headerRight: () => {
            return (
              <>
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
                <Link href="/(admin)/menu/create" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        name="plus-square-o"
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
      />
    </Stack>
  );
}
