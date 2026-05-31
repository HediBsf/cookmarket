import { getCurrentUser } from "@/lib/auth";

export type CartItem = {
  id: number;
  itemType: "DISH" | "FORMATION";
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  sellerId?: number;
  sellerName?: string;
  sellerD17PhoneNumber?: string | null;
};

const CART_KEY = "cookmarket_cart";

function getCartKey(): string {
  if (typeof window === "undefined") {
    return CART_KEY;
  }
  const user = getCurrentUser();
  return user ? `${CART_KEY}_${user.id}` : `${CART_KEY}_guest`;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  const cart = window.localStorage.getItem(getCartKey());
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(item: Omit<CartItem, "quantity">): void {
  if (typeof window === "undefined") {
    return;
  }
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id && c.itemType === item.itemType);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  window.localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

export function removeFromCart(id: number, itemType: CartItem["itemType"]): void {
  if (typeof window === "undefined") {
    return;
  }
  const cart = getCart();
  const filtered = cart.filter((c) => !(c.id === id && c.itemType === itemType));
  window.localStorage.setItem(getCartKey(), JSON.stringify(filtered));
}

export function updateQuantity(id: number, itemType: CartItem["itemType"], quantity: number): void {
  if (typeof window === "undefined") {
    return;
  }
  const cart = getCart();
  const item = cart.find((c) => c.id === id && c.itemType === itemType);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(id, itemType);
    } else {
      item.quantity = quantity;
      window.localStorage.setItem(getCartKey(), JSON.stringify(cart));
    }
  }
}

export function clearCart(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(getCartKey());
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}
