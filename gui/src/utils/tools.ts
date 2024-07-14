export function capitalizeFirstLetter(value: string) {
  const newValue = value.replace("-", " ");
  return newValue.charAt(0).toUpperCase() + newValue.slice(1);
}
