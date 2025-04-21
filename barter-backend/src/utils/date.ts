// Utility to convert any date to IST string for display
export function toISTString(date: Date | string | number) {
  return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}
