import { verifyJWT } from "../../utils";

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  const data = await verifyJWT(token);
  if (data) {
    req.user = data.id;
    return next();
  }
  return res.json({
    data: {},
    success: false,
    message: "Unauthorised",
  });
};
