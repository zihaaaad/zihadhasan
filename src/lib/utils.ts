import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs))
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]) {
 const processRow = (row: (string | number | boolean | null | undefined)[]) => {
 return row.map(val => {
 if (val === null || val === undefined) return '""';
 const str = String(val);
 // Escape quotes and wrap in quotes if contains comma, quote or newline
 if (str.includes(",") || str.includes('"') || str.includes("\n")) {
 return `"${str.replace(/"/g, '""')}"`;
 }
 return str;
 }).join(",");
 };

 const csvContent = "\uFEFF" + [ // Add BOM for Excel compatibility
 processRow(headers), // Headers also need processing to be safe
 ...rows.map(processRow)
 ].join("\n");

 const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
 const url = URL.createObjectURL(blob);
 const link = document.createElement("a");
 link.setAttribute("href", url);
 link.setAttribute("download", filename);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
}

/**
 * Narrow an unknown thrown value to a displayable message.
 *
 * Catch clauses used to be typed `catch (error: any)` and read `error.message`
 * directly, which is undefined for anything that is not an Error - a thrown
 * string, or one of the bare string rejections this codebase uses in a few
 * transactions ("Registration not found").
 */
export function errorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
}

/** Firebase Auth and Firestore errors carry a string `code` such as `auth/invalid-credential`. */
export function errorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return undefined;
}
