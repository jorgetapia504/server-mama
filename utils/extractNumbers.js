export const extractNumbers = (str) => {
  const numbers = str.replace(/\D/g, "")
  const numbersFilters = numbers.replace(/^0+/, '')
  if (numbersFilters) {
    return numbersFilters
  }
  return undefined
}