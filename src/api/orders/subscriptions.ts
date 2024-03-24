import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export const useInsertOrderSubscription = () => {
  const queryClient = useQueryClient();
  //! Real time subscription
  React.useEffect(() => {
    const ordersSubsription = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();
    return () => {
      ordersSubsription.unsubscribe();
    };
  }, []);
};
export const useUpdateOrderSubscription = (id: number) => {
  const queryClient = useQueryClient();
  //! Real time subscription
  React.useEffect(() => {
    const orders = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders", id] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
};
