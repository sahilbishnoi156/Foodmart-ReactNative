import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { useAuth } from "@/src/providers/AuthProvider";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, CheckBox, Chip, Icon } from "@rneui/themed";
import Colors from "@/src/constants/Colors";
import RemoteImage from "@/src/components/Orders/RemoteImage";
import { supabase } from "@/src/lib/supabase";
import { useGetProfile, useUpdateProfile } from "@/src/api/user";
import { Stack } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

//* FORM validation
const userSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Should be minimum of 2 characters")
    .max(16, "Should be maximum of 16 characters"),
});

const Profile = () => {
  //! Getting user by custom hook
  const { session, loading } = useAuth();


  const { data: profile } = useGetProfile(session?.user?.id!);
  const { mutate: updateProfile } = useUpdateProfile();
  const [refreshing, setRefreshing] = React.useState(false);
  const queryClient = useQueryClient();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ["profiles", { userId: session?.user?.id }],
    });
    setRefreshing(false);
  }, []);

  //! Local States
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  //! Submitting user form
  const handleOnSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("newdata", data);
      // updateProfile(data, {
      //   onSuccess: () => {
      //     setIsSubmitting(false);
      //   },
      // });
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  
  //! while user is loading
  if (loading) {
    <View style={styles.container}>
      <ActivityIndicator size={"large"} />
    </View>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <Pressable>
                {({ pressed }) => (
                  <Icon
                    name="logout"
                    style={{ marginRight: 25 }}
                    onPress={() =>
                      Alert.alert(
                        "Confirm",
                        "Are you sure you want to log out?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Log Out",
                            onPress: () => supabase.auth.signOut(),
                          },
                        ]
                      )
                    }
                  />
                )}
              </Pressable>
            );
          },
        }}
      />
      <View style={styles.user}>
        <RemoteImage
          path={profile?.avatar_url}
          fallback={
            "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
          }
          style={styles.image}
        />
      </View>
      <Formik
        validationSchema={userSchema}
        onSubmit={(values) => {
          handleOnSubmit(values);
        }}
        initialValues={{
          full_name: profile?.full_name || "",
        }}
      >
        {({ values, errors, touched, isValid, handleChange, handleSubmit }) => {
          return (
            <View style={{ width: "100%" }}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                placeholder="Full Name"
                style={[
                  styles.input,
                  {
                    borderColor:
                      touched.full_name && errors.full_name
                        ? "#ff9999"
                        : "#d1d1d1",
                    borderWidth: 1,
                  },
                ]}
                editable={false}
                value={values.full_name}
                onChangeText={handleChange("full_name")} // Change this line
              />
              {touched.full_name && errors.full_name && (
                <Text style={styles.errorText}>
                  {errors.full_name.toString()}
                </Text>
              )}
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={session?.user?.email}
                editable={false}
              />
              <Text style={styles.label}>Role (can't be changed)</Text>
              <TextInput
                placeholder="Role"
                style={styles.input}
                value={profile?.group}
                editable={false}
              />
              <View style={styles.user}>
                <Text style={styles.userText}>
                  Since: {new Date(session?.user?.created_at!).toDateString()}
                </Text>
              </View>
              <Button
                onPress={() => handleSubmit()}
                radius={12}
                loading={isSubmitting}
                raised
                disabled={!isValid || true}
                size="lg"
                color={isValid ? Colors.light.tint : ""}
                containerStyle={{ marginTop: 20 }}
              >
                Update
              </Button>
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 25,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 100,
    marginBottom: 20,
  },
  input: {
    borderRadius: 10,
    backgroundColor: "white",
    padding: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "#fa6666",
  },
  user: {
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  userText: {
    alignSelf: "flex-start",
    fontWeight: "500",
    fontSize: 17,
  },
});
