
export default class Validator {

  /**
   * Helper function to print a message when the date is formatted incorrectly.
   * @ param {String} fieldName - the field name of the parameter
   */
  invalidDateStringMessage(fieldName) {
    return fieldName + ' is not formatted correctly. Expecting YYYY-MM-DDTHH:MM:SSZ';
  }

  /**
   * Helper function to print a message when the genre code is formatted incorrectly.
   * @ param {String} fieldName - the field name of the parameter
   */
  invalidGenreCodeMessage(fieldName) {
    return fieldName + ' is not formatted correctly.  Expecting a short string such as, AR, CH, H2, etc.'
  }

  /**
   * Helper function to print a message when an integer parameter is formatted incorrectly.
   * @ param {String} fieldName - the field name of the parameter
   */
  invalidParameterMessage(fieldName) {
    return fieldName + ' parameter is not formatted correctly. Expecting an integer';
  }

  /**
   * Helper function to print a message when a parameter is missing.
   * @ param {String} fieldName - the field name of the missing parameter
   */
  missingParameterMessage(fieldName) {
    return fieldName + ' parameter is missing, please check your query.';
  }

  /**
   * Helper function to verify that the proper format is used for date strings.
   * @ param {String} dateString - the date string to test
   */
  checkDateFormat(dateString) {
    let dateFormat = /\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}Z/gi;
    
    return dateFormat.test(dateString);
  }

  /**
   * Helper function to verify the proper format is used for number strings.
   * @ param {String} numberString - the number string to test
   */
  checkResponseIsNumber(numberString) {
    return !isNaN(parseFloat(numberString)) && isFinite(numberString);
  }

  /**
   * Helper function to verify the proper format is used for genreCodes.
   * @ param {String} genreCode - the string of the genre code to test
   */
  checkGenreCode(genreCode) {
    let codeFormat = /[a-z0-9]{2,4}/gi;
    
    return codeFormat.text(genreCode);
  }
}
