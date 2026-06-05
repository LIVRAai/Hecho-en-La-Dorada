import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}
