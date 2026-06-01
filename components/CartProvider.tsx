"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface CartItem {
  gameId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string;
  platform: string;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (gameId: string) => void;
  clear: () => void;
  total: number;
  count: number;
  isInCart: (gameId: string) => boolean;
}

const CartContext = createContext<CartContextValue>({
  items: [], add: () => {}, remove: () => {}, clear: () => {}, total: 0, count: 0, isInCart: () => false,
});

const KEY = "kadestore.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
    }
  }, [items, hydrated]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => (prev.find((i) => i.gameId === item.gameId) ? prev : [...prev, item]));
  }, []);
  const remove = useCallback((gameId: string) => {
    setItems((prev) => prev.filter((i) => i.gameId !== gameId));
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const isInCart = useCallback((gameId: string) => items.some((i) => i.gameId === gameId), [items]);

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, count, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
