import ko from "knockout";
import $ from "jquery";
import { showErrorToast, showSuccessToast } from "../utility/toast";
import AppManager from "../appManager";
import AuthService from "../service/authService";
import UserProfileService from "../service/userProfileService";
import ContactService from "../service/contactService";

function contactProfileViewModel(profileId) {
  const self = this;

  self.firstName = ko.observable("f");
  self.lastName = ko.observable("l");
  self.email = ko.observable("");
  self.biography = ko.observable("");
  self.address = ko.observable("");
  self.profileBase64 = ko.observable("");
  self.profileId = ko.observable("");
  self.userName = ko.computed(function () {
    return `${self.firstName()}  ${self.lastName()}`;
  });
  self.hasProfileImage = ko.computed(function () {
    return self.profileBase64() !== "";
  });

  self.loading = true;

  // private
  async function fetchcontactProfileAsync(profileId) {
    const result = await UserProfileService.instance.getByProfileId(profileId);
    if (result.flag) {
      // setting bindings
      self.firstName(result.data.firstName);
      self.lastName(result.data.lastName);
      self.email(result.data.email);
      self.address(result.data.address);
      self.biography(result.data.biography);
      self.profileBase64(result.data.profileBase64);
      self.profileId(result.data.id);
      console.log(result.data);
    } else {
      showErrorToast({ text: result.message });
    }
  }

  fetchcontactProfileAsync(profileId);

  self.logout = function () {
    AuthService.instance.logout();
  };

  self.onSendInvitation = async function () {
    const contactProfileId = self.profileId(); // other proifle id
    const result = await ContactService.instance.sendContactRequest(
      contactProfileId
    );
    if (!result.flag) {
      showErrorToast({ text: result.message });
    } else {
      showSuccessToast({ text: result.message });
    }
  };
}

export default contactProfileViewModel;
