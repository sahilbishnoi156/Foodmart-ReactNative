import { ActivityIndicator, Image as reactNativeImage } from "react-native";
import React, { ComponentProps, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Image } from "@rneui/themed";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof reactNativeImage>, "source">;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!path || path.startsWith("http")) return;
    (async () => {
      setImage("");
      const { data, error } = await supabase.storage
        .from("product-images")
        .download(path);

      if (error) {
        console.log(error);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) {
  }

  return (
    <Image
      source={{ uri: image || fallback }}
      {...imageProps}
      containerStyle={imageProps.style}
      placeholderStyle={{ height: "100%", backgroundColor: "transparent" }}
      PlaceholderContent={<ActivityIndicator size={"large"} color={"blue"} />}
    />
  );
};

export default RemoteImage;
