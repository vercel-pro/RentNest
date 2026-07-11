import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = async (
  payload: JwtPayload,
  //   secret: Secret,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifiedToken = async (accessToken: string, secret: Secret) => {
  try {
    const verifiedToken = jwt.verify(accessToken, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.error("Token Verification Failed: ", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  createToken,
  verifiedToken,
};
