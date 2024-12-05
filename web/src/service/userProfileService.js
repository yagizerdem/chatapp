import axios from "axios";
import BaseService from "./baseService";
import UserProfileModel from "../model/userProfileModel";
import ProfileUpasertModel from "../model/profileUpsertModel";

class UserProfileService extends BaseService {
  static instance = null;
  constructor() {
    super();
    if (!UserProfileService.instance) {
      UserProfileService.instance = this;
    } else {
      return UserProfileService.instance;
    }
  }

  async getOwnProfile() {
    const userId = window.localStorage.getItem("userid");
    const apiUrl = `${this.baseApiUrl}/profile/byUserId?userId=${userId}`;
    try {
      const response = await axios.get(apiUrl);
      const profile = response.data.data;
      if (!profile) {
        return null;
      }
      const userProfileModel = new UserProfileModel();
      // map
      userProfileModel.id = profile.id;
      userProfileModel.address = profile.address;
      userProfileModel.biography = profile.biography;
      userProfileModel.profileBase64 = profile.profileBase64;
      userProfileModel.userId = profile.user.id;
      userProfileModel.firstName = profile.user.firstName;
      userProfileModel.lastName = profile.user.lastName;
      userProfileModel.email = profile.user.email;
      //
      return userProfileModel;
    } catch (error) {
      console.log(error, "error");
      return null;
    }
  }

  /**
   * log in user.
   *
   * @async
   * @param {ProfileUpasertModel} model - The model containing user registration details.
   */
  async upsertProfile(model) {
    const apiUrl = `${this.baseApiUrl}/profile/`;
    try {
      const jwt = localStorage.getItem("jwt");
      const result = await axios.post(apiUrl, model, {
        headers: {
          Authorization: `Bearer ${jwt}`, // Add the Bearer token here
          "Content-Type": "application/json", // Optional: specify content type
        },
      });
      return { flag: true, message: "profile updated successfully" };
    } catch (error) {
      return { flag: false, message: error.response.data.message };
    }
  }

  async getProfileBulk(page, limit, userName) {
    const apiUrl = `${this.baseApiUrl}/profile/getbulk?page=${page}&limit=${limit}&userName=${userName}`;
    try {
      const result = await axios.get(apiUrl);
      const data = result.data.data.map((record) => {
        const newUserProfileModel = new UserProfileModel();
        newUserProfileModel.address = record["address"];
        newUserProfileModel.id = record["id"];
        newUserProfileModel.profileBase64 = record["profileBase64"];
        newUserProfileModel.biography = record["biography"];
        newUserProfileModel.firstName = record["user"]["firstName"];
        newUserProfileModel.lastName = record["user"]["lastName"];
        newUserProfileModel.email = record["user"]["email"];
        newUserProfileModel.userId = record["user"]["id"];

        return newUserProfileModel;
      });

      return { flag: true, data: data, message: "user fetched" };
    } catch (error) {
      return { flag: false, data: [], message: error.response.data.message };
    }
  }
  async getByProfileId(profileId) {
    const apiUrl = `${this.baseApiUrl}/profile?profileId=${profileId}`;
    try {
      const result = await axios.get(apiUrl);

      // mapping
      const newUserProfileModel = new UserProfileModel();
      newUserProfileModel.address = result.data.data["address"];
      newUserProfileModel.biography = result.data.data["biography"];
      newUserProfileModel.profileBase64 = result.data.data["profileBase64"];
      newUserProfileModel.firstName = result.data.data["user"]["firstName"];
      newUserProfileModel.lastName = result.data.data["user"]["lastName"];
      newUserProfileModel.email = result.data.data["user"]["email"];
      newUserProfileModel.id = result.data.data["id"];

      return {
        flag: true,
        message: result.data.message,
        data: newUserProfileModel,
      };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ?? "internal server error";
      return { flag: false, message: errorMessage };
    }
  }
}

new UserProfileService(); // generate instance
export default UserProfileService;
