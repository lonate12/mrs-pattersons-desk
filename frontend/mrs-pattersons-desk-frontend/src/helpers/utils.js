/*
 * Function to add trailing zeros to an integer, need this to be able to compare
 * the expiration time in the JWT token and the current time on the browser
 * 
 * @param: {int} num: the int to add the trailing zeros to
 * @param: {int} desiredLength: the desired end length of the final result
 * 
 * @result: {int} the num plus any number of trailing zeros needed to make it the desired length
 */ 
export function addTrailingZeros(num, desiredLength) {
    const lenOfNum = num.toString().length;
    // If the num is already at or greater than the desiredLength, return the num unchanged
    if (lenOfNum >= desiredLength) { return num; }

    const multiplier = Math.pow(10, (desiredLength - lenOfNum));
    return num * multiplier;
}

export function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }