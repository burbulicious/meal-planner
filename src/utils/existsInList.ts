const itemExists = (inputString: string, listString: string): boolean => {
  const arrayOfStrings = listString.toLowerCase().split(',')
  return arrayOfStrings.includes(inputString.toLowerCase())
}

export default itemExists
