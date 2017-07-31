
export default class Validator {

  invalidDateStringMessage(fieldName) {
    return fieldName + ' is not formatted correctly. Expecting YYYY-MM-DDTHH:MM:SSZ';
  }

  invalidGenreCodeMessage(fieldName) {
    return fieldName + ' is not formatted correctly.  Expecting a short string such as, AR, CH, H2, etc.'
  }

  invalidParameterMessage(fieldName) {
    return fieldName + ' parameter is not formatted correctly. Expecting an integer';
  }

  missingParameterMessage(fieldName) {
    return fieldName + ' parameter is missing, please check your query.';
  }

  checkDateFormat(dateString) {
    let dateFormat = /\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}Z/gi;
    
    return dateFormat.test(dateString);
  }

  checkResponseIsNumber(numberString) {
    return !isNaN(parseFloat(numberString)) && isFinite(numberString);
  }

  checkGenreCode(genreCode) {
    let codeFormat = /[a-z0-9]{2,4}/gi;
    
    return codeFormat.text(genreCode);
  }
}
