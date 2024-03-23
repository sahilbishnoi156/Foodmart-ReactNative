import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Button from "@/src/components/Button";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";
import products from "@/assets/data/products";

//* FORM validation
const productSchema = Yup.object().shape({
  productName: Yup.string()
    .min(4, "Should be minimum of 4 characters")
    .max(16, "Should be maximum of 16 characters")
    .required("Name is required"),
  productPrice: Yup.number().required("Price is required"),
});

const CreateProductScreen = () => {
  //! Checking if product is updating or creating
  const { id } = useLocalSearchParams();
  const isUpdating = !!id;
  const product = products.find((p) => p.id.toString() === id) || {
    name: "",
    price: 0,
    image: "",
  };

  //! Local States
  const [image, setImage] = React.useState<string>(
    !isUpdating ? defaultPizzaImage : product?.image
  );

  //! Create or update the product
  const handleOnSubmit = (data: any) => {
    console.log(data);
  };

  //! pickImage
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //! HandleDeleteProduct
  const handleDeleteProduct = () => {
    console.warn("Product deleted");
  };

  const confirmDeleteProduct = () => {
    Alert.alert("Confirm", "Are you sure want to delete this product?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: handleDeleteProduct },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update product" : "Create product" }}
      />
      <View>
        <Image source={{ uri: image }} style={styles.image} />
        <Pressable style={styles.selectButton} onPress={pickImage}>
          {({ pressed }) => (
            <>
              <FontAwesome
                name="pencil"
                size={20}
                style={{ opacity: pressed ? 0.8 : 1, color: Colors.light.tint }}
              />
              <Text
                style={{
                  opacity: pressed ? 0.8 : 1,
                  color: Colors.light.tint,
                  fontSize: 20,
                }}
              >
                Select Image
              </Text>
            </>
          )}
        </Pressable>
      </View>
      <Formik
        initialValues={{
          productName: product.name,
          productPrice: product.price,
        }}
        validationSchema={productSchema}
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
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Name"
              style={[
                styles.input,
                {
                  borderColor:
                    touched.productName && errors.productName
                      ? "#ff9999"
                      : "#d1d1d1",
                  borderWidth: 1,
                },
              ]}
              value={values.productName}
              onChangeText={handleChange("productName")}
            />
            {touched.productName && errors.productName && (
              <Text style={styles.errorText}>{errors.productName}</Text>
            )}
            <Text style={styles.label}>Price</Text>
            <TextInput
              placeholder="Price in $"
              style={[
                styles.input,
                {
                  borderColor:
                    touched.productPrice && errors.productPrice
                      ? "#ff9999"
                      : "#d1d1d1",
                  borderWidth: 1,
                },
              ]}
              keyboardType="numeric"
              value={values.productPrice.toString()}
              onChangeText={handleChange("productPrice")}
            />
            {touched.productPrice && errors.productPrice && (
              <Text style={styles.errorText}>{errors.productPrice}</Text>
            )}
            <Pressable style={{ marginTop: 10 }}>
              {({ pressed }) => (
                <Button
                  text={isUpdating ? "Update" : "Create"}
                  onPress={() => handleSubmit()}
                  disabled={!isValid}
                  style={{
                    backgroundColor: isValid ? Colors.light.tint : "#969595",
                  }}
                />
              )}
            </Pressable>
            <Text style={styles.deleteButton} onPress={confirmDeleteProduct}>
              Delete
            </Text>
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
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 100,
  },
  selectButton: {
    marginTop: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  deleteButton: {
    color: "red",
    alignSelf: "center",
    fontSize: 18,
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
