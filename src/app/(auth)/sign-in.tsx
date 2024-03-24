import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Colors from "@/src/constants/Colors";
import { Link, Stack } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { Button } from "@rneui/themed";

//* FORM validation
const formSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Should be at least 8 characters"),
});

const CreateProductScreen = () => {
  //! Local states
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  //! handling signin
  const handleOnSubmit = async (data: any) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      Alert.alert(error.message);
      setIsSubmitting(false);
      return;
    }
  };
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign In" }} />
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={formSchema}
        onSubmit={(values) => {
          handleOnSubmit(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleChange,
          handleReset,
          handleSubmit,
          /* and other goodies */
        }) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="joe@example.com"
              style={[
                styles.input,
                {
                  borderColor:
                    touched.email && errors.email ? "#ff9999" : "#d1d1d1",
                  borderWidth: 1,
                },
              ]}
              value={values.email}
              onChangeText={handleChange("email")}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="********"
              style={[
                styles.input,
                {
                  borderColor:
                    touched.password && errors.password ? "#ff9999" : "#d1d1d1",
                  borderWidth: 1,
                },
              ]}
              secureTextEntry={true}
              value={values.password.toString()}
              onChangeText={handleChange("password")}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Button
              onPress={() => handleSubmit()}
              radius={14}
              loading={isSubmitting}
              raised
              disabled={!isValid}
              size="lg"
              color={Colors.light.tint}
              containerStyle={{ marginTop: 20 }}
            >
              Sign In
            </Button>
            <Link href={"/(auth)/sign-up"} asChild>
              <Text style={styles.lowerButton}>Don't have an account?</Text>
            </Link>
          </>
        )}
      </Formik>
    </View>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  selectButton: {
    marginTop: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  lowerButton: {
    color: "#465ff0",
    alignSelf: "center",
    marginTop: 10,
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
});
