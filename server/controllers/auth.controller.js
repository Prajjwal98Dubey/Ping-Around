import { OAuth2Client } from "google-auth-library";
import { checkUserExists } from "../helpers/user.helpers.js";
import { nanoid } from "nanoid";
import { generateToken } from "../helpers/jwt.helpers.js";
import { genSalt, hash, compare } from "bcrypt";
import pingPool from "../db/configDB.js";

export const validateGoogleAuth = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();
    const userDetails = await checkUserExists(email);
    if (userDetails.isUserExists) {
      const accessToken = generateToken(
        userDetails.user.user_id,
        userDetails.user.user_email
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
      });
      const userSocials = await pingPool.query(
        "SELECT * FROM USER_SOCIALS WHERE USER_ID = $1",
        [userDetails.user.user_id]
      );
      return res.status(200).json({
        message: "google auth success",
        userDetails: { ...userDetails.user, ...userSocials.rows[0] },
      });
    } else {
      const userId = nanoid();
      const refreshToken = generateToken(userId, email);
      const accessToken = generateToken(userId, email);

      await pingPool.query(
        "INSERT INTO USERS (USER_ID,USER_EMAIL,FIRST_NAME,USER_IMAGE,REFRESH_TOKEN,THIRD_PARTY_LOGIN) VALUES ($1,$2,$3,$4,$5,$6)",
        [userId, email, name, picture, refreshToken, true]
      );
      await pingPool.query(
        "INSERT INTO USER_SOCIALS (USER_ID,USER_LINKEDIN,USER_GITHUB,USER_INSTAGRAM,USER_TWITTER,USER_FACEBOOK,USER_REDDIT,USER_RANDOM_SOCIAL) VALUES ($1,null,null,null,null,null,null,null)",
        [userId]
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
      });
      return res.status(200).json({
        message: "google auth success",
        userDetails: {
          user_id: userId,
          user_email: email,
          first_name: name,
          user_image: picture,
          last_name: null,
          gender: null,
          phone: null,
          bio: null,
          city: null,
          country: null,
          country_code: null,
          profession: null,
          user_linkedin: null,
          user_github: null,
          user_instagram: null,
          user_twitter: null,
          user_reddit: null,
          user_facebook: null,
          user_random_social: null,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized");
  }
};

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDetails = await checkUserExists(email);
    if (userDetails.isUserExists) {
      return res.status(409).json({ message: "user already exists." });
    } else {
      const userId = nanoid();
      const refreshToken = generateToken(userId, email);
      const accessToken = generateToken(userId, email);
      const firstName = email.split("@")[0];
      const salt = await genSalt(10);
      const encryptPassword = await hash(password, salt);
      await pingPool.query(
        "INSERT INTO USERS (USER_ID,USER_EMAIL,FIRST_NAME,REFRESH_TOKEN,USER_PASSWORD) VALUES ($1,$2,$3,$4,$5)",
        [userId, email, firstName, refreshToken, encryptPassword]
      );
      await pingPool.query(
        "INSERT INTO USER_SOCIALS (USER_ID,USER_LINKEDIN,USER_GITHUB,USER_INSTAGRAM,USER_TWITTER,USER_FACEBOOK,USER_REDDIT,USER_RANDOM_SOCIAL) VALUES ($1,null,null,null,null,null,null,null)",
        [userId]
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
      });
      return res.status(201).json({
        message: "user registered",
        userDetails: {
          user_id: userId,
          first_name: firstName,
          user_email: email,
          last_name: null,
          gender: null,
          phone: null,
          user_image: null,
          bio: null,
          city: null,
          country: null,
          country_code: null,
          profession: null,
          user_linkedin: null,
          user_github: null,
          user_instagram: null,
          user_twitter: null,
          user_reddit: null,
          user_facebook: null,
          user_random_social: null,
        },
      });
    }
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(400).json({ message: "something went wrong !!!" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDetails = await checkUserExists(email);
    if (userDetails.isUserExists) {
      if (userDetails.user.third_party_login) {
        return res
          .status(200)
          .json({ isThirdParyLogin: true, message: "login through Google" });
      }
      let queryResult = await pingPool.query(
        "SELECT USER_PASSWORD FROM USERS WHERE USER_ID=$1",
        [userDetails.user.user_id]
      );
      const userPassword = queryResult.rows[0].user_password;
      const isPasswordCorrect = await compare(password, userPassword);
      if (isPasswordCorrect) {
        const accessToken = generateToken(userDetails.user.user_id, email);
        let userSocials = await pingPool.query(
          "SELECT * FROM USER_SOCIALS WHERE USER_ID = $1",
          [userDetails.user.user_id]
        );
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });
        return res.status(200).json({
          isThirdParyLogin: false,
          userDetails: { ...userDetails.user, ...userSocials.rows[0] },
        });
      } else {
        return res.status(401).json({ message: "wrong credentials" });
      }
    } else {
      return res.status(400).json({ message: "user is not present" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const editUser = async (req, res) => {
  const user_socials_list = [
    "user_linkedin",
    "user_github",
    "user_instagram",
    "user_twitter",
    "user_reddit",
    "user_facebook",
    "user_random_social",
  ];
  const userId = req.userId;
  const updatedField = req.body;
  try {
    let userDetailsQuery = [];
    let userSocailsQuery = [];
    for (let key in updatedField) {
      if (user_socials_list.includes(key)) {
        if (updatedField[key]) {
          userSocailsQuery.push(`${key}='${updatedField[key]}'`);
        } else {
          userSocailsQuery.push(`${key}=${updatedField[key]}`);
        }
      } else {
        if (updatedField[key]) {
          userDetailsQuery.push(`${key}='${updatedField[key]}'`);
        } else {
          userDetailsQuery.push(`${key}=${updatedField[key]}`);
        }
      }
    }
    if (userDetailsQuery.length)
      await pingPool.query(
        `UPDATE USERS SET ${userDetailsQuery.join(
          ","
        )} WHERE USER_ID = '${userId}'`
      );
    if (userSocailsQuery.length) {
      let isSocialsPresent = await pingPool.query(
        "SELECT USER_ID FROM USER_SOCIALS WHERE USER_ID = $1",
        [userId]
      );
      if (isSocialsPresent.rowCount) {
        await pingPool.query(
          `UPDATE USER_SOCIALS SET ${userSocailsQuery.join(
            ","
          )} WHERE USER_ID = '${userId}'`
        );
      } else {
        let queryList = [];
        user_socials_list.forEach((social) => {
          if (updatedField[social]) queryList.push(updatedField[social]);
          else queryList.push(null);
        });
        await pingPool.query(
          "INSERT INTO USER_SOCIALS (user_id,user_linkedin,user_github,user_instagram,user_twitter,user_reddit,user_facebook,user_random_social) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
          [userId, ...queryList]
        );
      }
    }
    return res.status(200).json({ message: "user details updated" });
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const userAuth = async (req, res) => {
  const userId = req.userId;
  try {
    const userDetails = await pingPool.query(
      "SELECT USER_ID,USER_EMAIL,FIRST_NAME,LAST_NAME,GENDER,PHONE,USER_IMAGE,BIO,CITY,COUNTRY_CODE,COUNTRY,THIRD_PARTY_LOGIN,PROFESSION FROM USERS WHERE USER_ID=$1",
      [userId]
    );
    const userSocials = await pingPool.query(
      "SELECT * FROM USER_SOCIALS WHERE USER_ID = $1",
      [userId]
    );
    return res.status(200).json({
      userDetails: { ...userDetails.rows[0], ...userSocials.rows[0] },
    });
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const getUserDetails = async (req, res) => {
  const userId = req.query.userId;
  try {
    let details = await pingPool.query(
      "SELECT U1.USER_ID,U1.FIRST_NAME,U1.USER_EMAIL,U1.GENDER,U1.BIO,U1.PHONE,U1.USER_IMAGE,U1.CITY,U1.COUNTRY,U1.COUNTRY_CODE,U1.PROFESSION,U2.USER_INSTAGRAM,U2.USER_TWITTER,U2.USER_LINKEDIN,U2.USER_GITHUB,U2.USER_REDDIT,U2.USER_FACEBOOK,U2.USER_RANDOM_SOCIAL FROM USERS U1 INNER JOIN USER_SOCIALS U2 ON U1.USER_ID = U2.USER_ID WHERE U1.USER_ID = $1",
      [userId]
    );
    if (!details.rowCount)
      return res.status(400).json({ message: "user does not exists." });
    return res.status(200).json({ ...details.rows[0] });
  } catch (error) {
    console.log(error);
  }
};
