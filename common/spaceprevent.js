export const handleSpaceKeyPress = (event) => {
  if (
    event.key === " " &&
    event.target.selectionStart === 0 &&
    event.keyCode === 32
  ) {
    return event.preventDefault();
  }
};
export const bindInput = (value) => {
  var regex = new RegExp("^[^0-9]*$");
  var key = String.fromCharCode(!value.charCode ? value.which : value.charCode);
  if (regex.test(key)) {
    value.preventDefault();
    return false;
  }
};
export const formatNumberWithCommas = (number) => {
  var nf = new Intl.NumberFormat('en-IN');
  return nf.format(number); ;
};
export const truncateAddress = (address, maxLength = 70) => {
  if (address.length > maxLength) {
    return address.substring(0, maxLength) + '...';
  }
  return address;
};
export function capitalizeFirstLetterOfEachWord(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}