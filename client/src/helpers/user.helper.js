export const compareUserDetails = (previousDetails, updatedDetails) => {
  let updatedField = {};
  for (let key in previousDetails) {
    if (previousDetails[key] !== updatedDetails[key])
      updatedField[key] = updatedDetails[key];
  }
  return updatedField;
};

export const compareNearUserDetails = (obj1, obj2) => {
  // obj2 is the new near users
  const checkIfAlreadyPresent = (k, userId) => {
    for (let obj of obj1[k]) {
      if (obj.user_id == userId) return { isPresent: true, isShow: obj.isShow };
    }
    return { isPresent: false };
  };
  let newNearUsers = {};
  for (let key of Object.keys(obj2)) {
    let tmp = [];
    for (let obj of obj2[key]) {
      let check = checkIfAlreadyPresent(key, obj.user_id);
      if (check.isPresent) {
        tmp.push({ ...obj, isShow: check.isShow });
      } else {
        tmp.push({ ...obj, isShow: false });
      }
    }
    newNearUsers[key] = [...tmp];
  }
  return newNearUsers;
};
