import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabase";
import Colors from "../constants/Colors";

const index = () => {
  const { session, loading, isAdmin } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  if (!isAdmin) {
    return <Redirect href={"/(user)"} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          alignSelf: "center",
          marginBottom: 10,
        }}
      >
        Welcom Admin
      </Text>
      <Link href={"/(user)"} asChild disabled={isLoggingOut}>
        <Button
          text="User"
          style={{
            backgroundColor: isLoggingOut ? "gray" : Colors.light.tint,
          }}
        />
      </Link>
      <Link href={"/(admin)"} asChild disabled={isLoggingOut}>
        <Button
          text="Admin"
          style={{
            backgroundColor: isLoggingOut ? "gray" : Colors.light.tint,
          }}
        />
      </Link>
      <Button
        text="Sign Out"
        disabled={isLoggingOut}
        style={{
          backgroundColor: isLoggingOut ? "gray" : Colors.light.tint,
        }}
        onPress={async () => {
          setIsLoggingOut(true);
          await supabase.auth.signOut();
          setIsLoggingOut(false);
        }}
      />
    </View>
  );
};

export default index;
