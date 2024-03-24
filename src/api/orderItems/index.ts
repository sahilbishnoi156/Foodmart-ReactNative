import { supabase } from "@/src/lib/supabase";
import { CartItem } from "@/src/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertTables } from "@/src/types";
import { useAuth } from "@/src/providers/AuthProvider";

export const useInsertOrderitems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(items: InsertTables<"order_items">[]) {
      const { data: newOrderItems, error } = await supabase
        .from("order_items")
        .insert(items)
        .select()
      if (error) {
        throw new Error(error.message);
      }
      return newOrderItems;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["order_items"] });
    },
  });
};
