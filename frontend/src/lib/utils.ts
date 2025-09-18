import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, isValid } from "date-fns"
import { id } from "date-fns/locale"

// Fungsi untuk menggabungkan class Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi untuk memformat tanggal ke format lokal Indonesia
export function formatDate(
  date: string | Date | number | null | undefined,
  formatStr: string = "dd MMMM yyyy"
): string {
  if (!date) return "-"
  
  let dateObj: Date
  
  // Konversi string ke Date jika diperlukan
  if (typeof date === "string") {
    dateObj = parseISO(date)
  } else if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === "number") {
    dateObj = new Date(date)
  } else {
    return "-"
  }
  
  // Jika tanggal tidak valid, kembalikan "-"
  if (!isValid(dateObj)) return "-"
  
  // Format tanggal dengan locale Indonesia
  return format(dateObj, formatStr, { locale: id })
}

// Fungsi untuk memformat tanggal dan waktu
export function formatDateTime(
  date: string | Date | number | null | undefined,
  formatStr: string = "dd MMM yyyy HH:mm"
): string {
  return formatDate(date, formatStr)
}

// Fungsi untuk memformat angka ke format mata uang Rupiah
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "Rp -"
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Fungsi untuk memformat nomor telepon
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "-"
  
  // Hapus semua karakter non-digit
  const digits = phone.replace(/\D/g, "")
  
  // Jika dimulai dengan 0, tambahkan kode negara Indonesia (+62)
  if (digits.startsWith("0")) {
    return "+62 " + digits.substring(1).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
  }
  
  // Jika dimulai dengan 62, tambahkan +
  if (digits.startsWith("62")) {
    return "+" + digits.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, "$1 $2-$3-$4")
  }
  
  // Format default
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
}

// Fungsi untuk mendapatkan inisial dari nama
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?"
  
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}