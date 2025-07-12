import pingPool from "../db/configDB.js";

export const checkUserExists = async (email) => {
  try {
    const user = await pingPool.query(
      "SELECT USER_ID,USER_EMAIL,FIRST_NAME,LAST_NAME,GENDER,PHONE,USER_IMAGE,BIO,CITY,COUNTRY_CODE,COUNTRY,THIRD_PARTY_LOGIN,PROFESSION FROM USERS WHERE USER_EMAIL=$1",
      [email]
    );
    if (user.rowCount) {
      return { isUserExists: true, user: { ...user.rows[0] } };
    }
    return { isUserExists: false };
  } catch (err) {
    console.log(err);
    return { isUserExists: false }; // give some message related to error.
  }
};
