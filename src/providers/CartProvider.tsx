import React, { PropsWithChildren, createContext, useContext } from "react";
import { CartItem, Tables } from "../types";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "../api/orders";
import { router } from "expo-router";
import { useInsertOrderitems } from "../api/orderItems";
import { initialisePaymentSheet, openPaymentSheet } from "../lib/stripe";

//! Cart Types
type CartType = {
  items: CartItem[];
  addItem: (product: Tables<"products">, size: CartItem["size"]) => void;
  updateQuantity: (id: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
  isCheckingOut: boolean;
};

//! Cart Context
export const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
  isCheckingOut: false,
});

//! Provider
const CartProvider = ({ children }: PropsWithChildren) => {
  //* Custom Hooks
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderitems();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  //* Provider States
  //! All cart items
  const [items, setItems] = React.useState<CartItem[]>([]);

  //! Add Item to cart
  const addItem = (product: Tables<"products">, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }
    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size: size,
      quantity: 1,
    };
    setItems((prev) => [newCartItem, ...prev]);
  };

  //! Update the quantity of cart
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((item: CartItem) =>
        item.id.toString() !== itemId
          ? item
          : { ...item, quantity: item.quantity + amount }
      )
      .filter((item) => item.quantity > 0);
    setItems(updatedItems);
  };

  //! Total Price of all items
  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  //! Checkout and save to database
  const checkout = async () => {
    setIsCheckingOut(true);
    await initialisePaymentSheet(Math.floor(total * 100));
    const payed = await openPaymentSheet();

    if (!payed) {
      setIsCheckingOut(false);
      return;
    }
    insertOrder({ total }, { onSuccess: saveOrderItems });
  };

  //! Saving items of order to database
  const saveOrderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess() {
        setItems([]);
        router.push(`/(user)/orders/${order.id}`);
        setIsCheckingOut(false);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        checkout,
        addItem,
        updateQuantity,
        total: total,
        isCheckingOut,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
