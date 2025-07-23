import pingPool from "../db/configDB.js";
import { haverSineDistance } from "../helpers/location.helpers.js";
export const userLocationDetails = async (req, res) => {
  const { userId, longitude, latitude } = req.body;
  try {
    const isUserLocationPresent = await pingPool.query(
      "SELECT USER_ID FROM LOCATION_DETAILS WHERE USER_ID=$1",
      [userId]
    );
    if (isUserLocationPresent.rowCount) {
      await pingPool.query(
        "UPDATE LOCATION_DETAILS SET LONGITUDE=$1,LATITUDE=$2,IS_ONLINE=$3 WHERE USER_ID=$4",
        [longitude, latitude, true, userId]
      );
    } else {
      await pingPool.query(
        "INSERT INTO LOCATION_DETAILS (USER_ID,LONGITUDE,LATITUDE,IS_ONLINE) VALUES ($1,$2,$3,$4)",
        [userId, longitude, latitude, true]
      );
    }
    return res.status(201).json({ message: "location updated" });
  } catch (error) {
    console.log(error);
  }
};

export const getCloseByUsers = async (req, res) => {
  const { lat, long } = req.query;
  try {
    let obj = { 1: [], 3: [], 5: [], 10: [], 11: [] };
    let userDetails = await pingPool.query(
      "SELECT U1.USER_ID,U1.FIRST_NAME,U1.USER_EMAIL,U1.USER_IMAGE,U1.PROFESSION,U2.LATITUDE,U2.LONGITUDE,U3.USER_INSTAGRAM,U3.USER_TWITTER,U3.USER_LINKEDIN,U3.USER_GITHUB,U3.USER_REDDIT,U3.USER_FACEBOOK,U3.USER_RANDOM_SOCIAL FROM USERS U1 INNER JOIN LOCATION_DETAILS U2 ON U1.USER_ID = U2.USER_ID INNER JOIN USER_SOCIALS U3 ON U2.USER_ID = U3.USER_ID"
    );
    for (let user of userDetails.rows) {
      let distance = haverSineDistance(
        { lat1: lat, lon1: long },
        { lat2: user["latitude"], lon2: user["longitude"] }
      );
      distance = Math.ceil(distance);
      if (0 <= distance && distance <= 1) obj[1].push({ ...user });
      else if (1 < distance && distance <= 3) obj[3].push({ ...user });
      else if (3 < distance && distance <= 5) obj[5].push({ ...user });
      else if (5 < distance && distance <= 10) obj[10].push({ ...user });
      else if (distance > 10) obj[11].push({ ...user });
    }
    return res.status(201).json({ locationDetails: obj });
  } catch (error) {
    console.log(error);
  }
};
