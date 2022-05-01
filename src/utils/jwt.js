import jwt from "jsonwebtoken";

export const signJWT = (payload = {}, expiry = "24h") => {
  try {
    const token = jwt.sign(payload, process.env.SECRET_JWT, {
      expiresIn: expiry,
    });
    return token;
  } catch (error) {
    return null;
  }
};

export const verifyJWT = async (token) => {
  try {
    const data = await jwt.verify(token, process.env.SECRET_JWT);
    return data;
  } catch (error) {
    return null;
  }
};
