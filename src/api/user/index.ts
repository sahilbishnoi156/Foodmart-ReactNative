import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { UpdateTables } from "@/src/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProfile = (id: string) => {
  return useQuery({
    queryKey: ["profiles", { userId: id }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

//! UPDATE SPECIFIC ORDER DETAILS (ADMIN)
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    async mutationFn(updatedFields: UpdateTables<"profiles">) {
      // Check if session user ID is available
      if (!session?.user?.id) {
        throw new Error("User ID not available in session.");
      }
      // Perform the update operation
      const {data: updatedProfile, error} = await supabase
        .from("profiles")
        .update({ full_name: updatedFields.full_name })
        .eq("id", session?.user?.id!);
      // Handle errors if any
      if (error) {
        return new Error(error.message);
      }
      if (!updatedProfile) {
        return new Error("No profile found to update.");
      }
      return updatedProfile;
    },
    // Invalidate the profiles query on successful update
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["profiles", { userId: session?.user?.id }],
      });
    },
  });
};
