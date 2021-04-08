export function removeKeys<T>(
  array: Array<any>,
  allowedKeys: Array<string>
): Array<T> {
  return array.map((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!allowedKeys.includes(key)) {
        delete obj[key]
      }
    })
    return obj
  })
}
