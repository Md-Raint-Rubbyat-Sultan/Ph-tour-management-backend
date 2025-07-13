import { Response } from "express";
import { envVars } from "../config/env";

export interface AuthTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
    });
  }
};
