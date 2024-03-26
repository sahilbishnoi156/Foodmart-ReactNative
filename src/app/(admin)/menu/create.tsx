import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import { defaultPizzaImage } from "@/src/constants/ExtraVariables";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/src/api/products";
import { Button } from "@rneui/themed";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/src/lib/supabase";
import { decode } from "base64-arraybuffer";
import RemoteImage from "@/src/components/Orders/RemoteImage";

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
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  const isUpdating = !!id;

  //! Initial Product
  let product:
    | {
        created_at?: string;
        id?: number;
        image: string | null;
        name: string;
        price: number | string;
      }
    | undefined = {
    name: "",
    price: "",
    image: "",
  };
  if (id) {
    const data = useProduct(id);
    product = data.data;
  }
  const router = useRouter();

  //! Local States
  const [image, setImage] = React.useState<string>(
    !isUpdating ? defaultPizzaImage : product?.image || defaultPizzaImage
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageIsChanged, setImageIsChanged] = React.useState(false);

  //! Custom Hook
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();

  //! Create or update the product
  const handleOnSubmit = async (data: any) => {
    setIsSubmitting(true);
    let newProduct = {
      ...product,
      name: data.productName,
      price: parseFloat(data.productPrice),
      image: image,
    };
    if (imageIsChanged) {
      const updatedImage = await uploadImage();
      newProduct.image = updatedImage!;
    }
    try {
      if (isUpdating) {
        updateProduct(newProduct, {
          onSuccess: () => {
            router.back();
            setIsSubmitting(false);
          },
          onError: (error) => {
            throw new Error(error.message);
          },
        });
      } else {
        insertProduct(newProduct, {
          onSuccess: () => {
            router.back();
            setIsSubmitting(false);
          },
        });
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
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
      setImageIsChanged(true);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });
    if (data) {
      return data.path;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update product" : "Create product" }}
      />
      <View>
        <RemoteImage
          path={image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
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
          productName: product?.name,
          productPrice: product?.price,
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
              placeholder="Price in ₹"
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
              value={values?.productPrice?.toString()}
              onChangeText={handleChange("productPrice")}
            />
            {touched.productPrice && errors.productPrice && (
              <Text style={styles.errorText}>{errors.productPrice}</Text>
            )}
            <Button
              onPress={() => handleSubmit()}
              radius={12}
              loading={isSubmitting}
              raised
              disabled={!isValid}
              size="lg"
              color={isValid ? Colors.light.tint : ""}
              containerStyle={{ marginTop: 20 }}
            >
              {isUpdating ? "Update" : "Create"}
            </Button>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

export default CreateProductScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: "100%",
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
  deleteSkeleton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
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
