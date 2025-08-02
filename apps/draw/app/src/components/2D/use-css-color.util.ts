export const getCssColorValues = (varName: string): [number, number, number] => {
  const rgbValues = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
    .split(',')
    .map(v => parseInt(v.trim()));

    // console.log(rgbValues)
  
  return [rgbValues[0], rgbValues[1], rgbValues[2]];
};