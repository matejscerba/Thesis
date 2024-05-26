export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function stringifyPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/,/g, " ");
}
