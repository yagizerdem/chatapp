import BaseService from "./baseService";
import axios from "axios";
import RegisterModel from "../model/registerModel";
import LogInModel from "../model/logInModel";

class AuthService extends BaseService {
  static instance = null;
  constructor() {
    super();
    if (!AuthService.instance) {
      AuthService.instance = this;
    } else {
      return AuthService.instance;
    }
  }
  /**
   * Registers a new user.
   *
   * @async
   * @param {RegisterModel} model - The model containing user registration details.
   */
  async register(model) {
    const apiUrl = `${this.baseApiUrl}/auth/register`;
    try {
      var response = await axios.post(apiUrl, model);
      const messageFromServer = response.data["message"];
      return { success: true, message: messageFromServer };
    } catch (err) {
      // Default error message for unknown or unreachable server
      let messageFromServer = "An error occurred. Please try again later.";

      // Check if the error response exists (server responded with a status)
      if (err.response && err.response.data && err.response.data["message"]) {
        messageFromServer = err.response.data["message"];
      } else if (
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        // Handle network errors specifically
        messageFromServer =
          "The server is not reachable. Please check your connection.";
      }

      return { success: false, message: messageFromServer };
    }
  }
  /**
   * log in user.
   *
   * @async
   * @param {LogInModel} model - The model containing user registration details.
   */
  async login(model) {
    const apiUrl = `${this.baseApiUrl}/auth/login`;
    try {
      const response = await axios.post(apiUrl, model);
      const messageFromServer = response.data["message"];
      return {
        success: true,
        message: messageFromServer,
        payload: response.data.data,
      };
    } catch (err) {
      // Default error message for unknown or unreachable server
      let messageFromServer = "An error occurred. Please try again later.";

      // Check if the error response exists (server responded with a status)
      if (err.response && err.response.data && err.response.data["message"]) {
        messageFromServer = err.response.data["message"];
      } else if (
        err.code === "ECONNABORTED" ||
        err.message.includes("Network Error")
      ) {
        // Handle network errors specifically
        messageFromServer =
          "The server is not reachable. Please check your connection.";
      }

      return { success: false, message: messageFromServer };
    }
  }

  logout() {
    window.localStorage.clear();
    window.location.hash = "#"; // rest hash
    window.location.reload();
  }
}
new AuthService();
export default AuthService;
