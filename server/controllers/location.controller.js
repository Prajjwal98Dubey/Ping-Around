import pingPool from "../db/configDB.js";
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

