const getFourRandomNumbers = (n: number): number[] => {
  const result: number[] = []
  while (result.length < 4) {
    const randomNumber = Math.floor(Math.random() * n)
    if (!result.includes(randomNumber)) {
      result.push(randomNumber)
    }
  }

  return result
}

export default getFourRandomNumbers
