export const compareUserDetails = (previousDetails, updatedDetails) => {
  let updatedField = {};
  for (let key in previousDetails) {
    if (previousDetails[key] !== updatedDetails[key])
      updatedField[key] = updatedDetails[key];
  }
  return updatedField;
};
