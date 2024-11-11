/**
 * validates user nicknames to ensure theres is only safe characters
 * @param {string} value
 */
export function validateSafeString(value) {
    const regex = /^[a-zA-Z0-9_ ]*$/
    return regex.test(value);
}

/**
 * validates user email to ensure theres is only valid and safe characters
 * @param {string} value 
 */
export function validateEmail(value) {
    if (typeof value !== 'string') return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(value);
}
/**
 * validates if there are any empty string in an array, return false if there is any null or empty string
 * @param {string[]} values 
 */
export function validateExistingStrings(values = []) {
    if (values.length == 0) throw Error("no values were given to check existence");
    return !values.some((value) => !value || value.trim().length == 0);
}