// utils/verifyUserSession.ts
import axios from "axios";
import { BACKEND_URL } from "../config/index";

const verifyUserSession = async (): Promise<boolean> => {
  try {
    const response = await axios.get(BACKEND_URL + "/auth/verify", {
      withCredentials: true,
    });
    return !!response.data.success;
  } catch (error) {
    console.log("Session verification failed:", error);
    return false;
  }
};

export default verifyUserSession;
