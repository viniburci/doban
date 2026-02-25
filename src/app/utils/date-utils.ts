export function parseDateString(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  const datePart = dateString.substring(0, 10);
  const date = new Date(datePart);
  return isNaN(date.getTime()) ? null : date;
}
