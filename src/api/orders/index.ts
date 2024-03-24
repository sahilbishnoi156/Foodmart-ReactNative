import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InsertTables, UpdateTables } from "@/src/types";

//! ADMIN ORDERS
export default function useAdminOrderList({ archived = false }) {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];
  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

//! USER ORDERS
export const useUserOrderList = () => {
  const { session } = useAuth();
  const id = session?.user?.id;
  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

//! GET SPECIFIC ORDER DETAILS (ADMIN AND USER BOTH)
export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
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
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) {
      const { data: updatedProduct, error } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
};

//! CREATE ORDER (USER AND ADMIN BOTH)
export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  return useMutation({
    async mutationFn(data: InsertTables<"orders">) {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({ ...data, user_id: session?.user?.id })
        .select()
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
