const roundUpToNearestInteger = (number: number): number => {
  const decimalPart = number - Math.floor(number)
  if (decimalPart >= 0.5) {
    return Math.ceil(number)
  } else {
    return Math.floor(number)
  }
}

export { roundUpToNearestInteger }
