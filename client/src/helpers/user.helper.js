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

export const randomColorGenerator = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r},${g},${b})`;
};

export const calculateHaverSineDistance = (coord1, coord2) => {
  const { lat1, lon1 } = coord1;
  const { lat2, lon2 } = coord2;
  const toRad = (angle) => angle * (Math.PI / 180);
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const calculateDefinedKey = (distance) => {
  distance = Math.ceil(distance);
  if (0 <= distance && distance <= 1) return 1;
  else if (1 < distance && distance <= 3) return 3;
  else if (3 < distance && distance <= 5) return 5;
  else if (5 < distance && distance <= 10) return 10;
  else if (distance > 10) return 11;
};
