import ko from "knockout";
import { showErrorToast, showSuccessToast } from "../utility/toast";
import convertFileToBase64 from "../utility/convertFileToBase64";
import ProfileUpasertModel from "../model/profileUpsertModel";
import UserProfileService from "../service/userProfileService";
import AuthService from "../service/authService";

/**
 * ViewModel for the user profile.
 *
 * @param {Object} profileModel - The initial data for the profile.
 * @param {string} profileModel.firstName - The user's first name.
 * @param {string} profileModel.lastName - The user's last name.
 * @param {string} profileModel.email - The user's email address.
 * @param {string} profileModel.id - The user's profile ID.
 * @param {string} [profileModel.biography] - The user's biography (optional).
 * @param {string} [profileModel.address] - The user's address (optional).
 * @param {string} [profileModel.profileBase64] - The user's profile picture in Base64 format (optional).
 * @param {string} profileModel.userId - The user's unique ID.
 */
function profileViewModel(profileModel) {
  var profileModel = JSON.parse(JSON.stringify(profileModel)); // deeop copy

  const self = this;
  self.firstName = ko.observable(
    profileModel?.firstName ?? localStorage.getItem("firstName") ?? ""
  );
  self.lastName = ko.observable(
    profileModel?.lastName ?? localStorage.getItem("lastName") ?? ""
  );
  self.email = ko.observable(
    profileModel?.email ?? localStorage.getItem("email") ?? ""
  );

  self.id = ko.observable(profileModel?.id ?? "");
  self.biography = ko.observable(profileModel?.biography ?? "");
  self.address = ko.observable(profileModel?.address ?? "");
  self.profileBase64 = ko.observable(profileModel?.profileBase64 ?? "");
  self.userId = ko.observable(profileModel?.userId ?? "");

  self.hasProfileImage = ko.computed(function () {
    return self.profileBase64() !== "";
  });

  self.logout = function () {
    window.localStorage.clear();
    window.location.hash = "#"; // rest hash
  };
  self.onUpdate = async function (formElement) {
    const formData = new FormData(formElement);
    const formDataObject = {};
    // Convert FormData to a plain object
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    console.log(formDataObject);

    const base64 = await convertFileToBase64(formDataObject["profileImage"]);

    const newProfileUpsertModel = new ProfileUpasertModel({
      address: formDataObject["address"],
      biography: formDataObject["biography"],
      profileBase64: base64,
    });

    const { flag, message } = await UserProfileService.instance.upsertProfile(
      newProfileUpsertModel
    );

    if (flag) {
      // valid update
      showSuccessToast({ text: message });
      showSuccessToast({ text: "ll be logged out in 3 seconds" });
      setTimeout(() => {
        AuthService.instance.logout();
      }, 3000);
    } else {
      showErrorToast({ text: message });
    }
  };
}

export default profileViewModel;
