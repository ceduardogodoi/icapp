/**
 * Takes the string representing a date in a format ddmmyyyy
 * and put forward slashes on it in order to represent
 * the string date as dd/mm/yyyy format.
 * @param {string} stringDate the string formatted as ddmmyyyy.
 */
export function dateSlashfy(stringDate) {
    const day = stringDate.substring(0, 2);
    const month = stringDate.substring(2, 4);
    const year = stringDate.substring(4, 8);

    return `${day}/${month}/${year}`;
}

export function padStart(text, length, character) {
    text = '' + text;
    if (text.length >= length) return text;
    
    for (let i = text.length; i < length; i++) {
      text = character + text;
    }
    
    return text;
  }