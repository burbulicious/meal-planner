const itemExists = (inputString: string, listString: string): boolean => {
  const arrayOfStrings = listString.toLocaleLowerCase().split(',')
  if (inputString.trim() !== '' && arrayOfStrings.includes(inputString.trim())) {
    return true
  }
  return false
}

export default itemExists
