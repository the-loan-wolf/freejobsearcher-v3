import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // spaces → hyphens
    .replace(/[^a-z0-9-]/g, ""); // remove special characters

export const deslugify = (str: string) =>
  str
    .replace(/-+/g, " ")        // hyphens → spaces
    .toUpperCase();
