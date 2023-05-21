export function getEnumVals<T>(theEnum: any) {
  return Object.keys(theEnum)
    .filter((x) => !isNaN(Number(x)))
    .map((x) => parseInt(x) as T);
}

export function getStrEnumVals<T>(theEnum: any) {
  return Object.values(theEnum).map((x) => x as T);
}
