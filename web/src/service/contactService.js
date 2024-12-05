import axios from "axios";
import BaseService from "./baseService";
import ContactRequestModel from "../model/contactRequestModel";
import UserProfileModel from "../model/userProfileModel";

class ContactService extends BaseService {
  static instance = null;
  constructor() {
    super();
    if (!ContactService.instance) {
      ContactService.instance = this;
    } else {
      return ContactService.instance;
    }
  }
  async sendContactRequest(destProfileId) {
    const apiUrl = `${this.baseApiUrl}/contact/contactrequest`;
    const requestData = {
      destProfileId,
    };
    try {
      const jwt = window.localStorage.getItem("jwt");
      const result = await axios.post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${jwt}`, // Include JWT in the Authorization header
          "Content-Type": "application/json", // Ensure JSON data is sent correctly
        },
      });
      return {
        flag: true,
        message: result.data.message,
        data: result.data.data,
      };
    } catch (error) {
      console.log(error);
      return {
        flag: false,
        message: error.response.data.message,
      };
    }
  }
  async loadContactRequest(page, limit) {
    const apiUrl = `${this.baseApiUrl}/contact/contactRequest?page=${page}&limit=${limit}`;
    const jwt = window.localStorage.getItem("jwt");
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${jwt}`, // Include JWT in the Authorization header
        },
      });
      console.log(response);

      const contactRequestModelsList = [];
      response.data.data.forEach((element) => {
        const newContactrequestModel = new ContactRequestModel();
        newContactrequestModel.createdAd = element["createdAt"];
        newContactrequestModel.firstName =
          element["fromProfile"]["user"]["firstName"];
        newContactrequestModel.lastName =
          element["fromProfile"]["user"]["lastName"];
        newContactrequestModel.email = element["fromProfile"]["user"]["email"];
        newContactrequestModel.base64profile =
          element["fromProfile"]["profileBase64"];
        newContactrequestModel.id = element["id"];

        contactRequestModelsList.push(newContactrequestModel);
      });

      return {
        flag: true,
        message: "contgact request fetched ",
        data: contactRequestModelsList,
      };
    } catch (error) {
      console.log(error);
      return { flag: false, message: error.response.data.message };
    }
  }

  async reject(requiestId) {
    // console.log(requiestId);
    const apiUrl = `${this.baseApiUrl}/contact/rejectrequest?contactRequestId=${requiestId}`;
    try {
      const jwt = window.localStorage.getItem("jwt");
      const response = await axios.post(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${jwt}`, // Include JWT in the Authorization header
        },
      });
    } catch (error) {
      console.log(error);
      return { flag: false, message: error.response.data.message };
    }
  }

  async accept(requiestId) {
    const apiUrl = `${this.baseApiUrl}/contact/acceptrequest?contactRequestId=${requiestId}`;
    const jwt = window.localStorage.getItem("jwt");
    try {
      const response = await axios.post(apiUrl, null, {
        headers: {
          Authorization: `Bearer ${jwt}`, // Add the Bearer token to the Authorization header
        },
      });
      console.log(response);
      return { flag: true, message: response.data.message };
    } catch (error) {
      console.log(error);
      return {
        flag: false,
        message: error.response.data.message,
      };
    }
  }

  async getContacts() {
    const page = 1;
    const limit = 10;
    var flag = true;
    const jwt = window.localStorage.getItem("jwt");
    console.log(jwt);
    const header = {
      headers: {
        Authorization: `Bearer ${jwt}`, // Include JWT in the Authorization header
      },
    };
    var store = [];
    while (flag) {
      const apiUrl = `${this.baseApiUrl}/contact/contact?page=${page}&limit=${limit}`;
      try {
        const response = await axios.get(apiUrl, header);
        response.data.data.forEach((element) => {
          store.push(element);
        });

        if (response.data.data.length < limit) {
          flag = false;
        } else {
          page++;
        }
      } catch (error) {
        console.log(error);
        break;
      }
    }
    // map to user profile model
    const contactProfiles = [];
    store.forEach((element) => {
      const newUserProfileModel = new UserProfileModel();
      newUserProfileModel.id = element["contactProfile"]["id"];
      newUserProfileModel.address = element["contactProfile"]["address"];
      newUserProfileModel.biography = element["contactProfile"]["biography"];
      newUserProfileModel.firstName =
        element["contactProfile"]["user"]["firstName"];
      newUserProfileModel.lastName =
        element["contactProfile"]["user"]["lastName"];
      newUserProfileModel.email = element["contactProfile"]["user"]["email"];
      newUserProfileModel.profileBase64 =
        element["contactProfile"]["profileBase64"];
      newUserProfileModel.userId = element["contactProfile"]["user"]["id"];

      contactProfiles.push(newUserProfileModel);
    });
    return contactProfiles;
  }
}

new ContactService(); // genrate instance
export default ContactService;
