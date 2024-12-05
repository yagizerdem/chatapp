import ko from "knockout";
import $ from "jquery";
import { showErrorToast, showSuccessToast } from "../utility/toast";
import { serialize } from "v8";
import AuthService from "../service/authService";
import UserProfileService from "../service/userProfileService";
import AppManager from "../appManager";
import SD from "../utility/SD";

function homeViewModel() {
  const self = this;
  self.searchUserInput = ko.observable("");
  self.searchedUserProfiles = ko.observableArray(); // data type userProfileModels
  self.page = 1;
  self.limit = 5;
  self.activContactProfile = ko.observable("");
  self.messages = ko.observableArray([]);

  this.searchUserInput.subscribe((newValue) =>
    self.onSearchQueryChange(newValue)
  );

  self.logout = function () {
    AuthService.instance.logout();
  };

  // search user related
  self.searchByUserName = async function () {
    await self.searchByUserNameHelper();
    console.log(this.searchedUserProfiles());
  };
  self.onSearchQueryChange = function (newValue) {
    self.page = 1; // reset page
    self.searchedUserProfiles([]); // clear data
    if (newValue.trim() === "") {
      console.log("close pop up");
      $("#searcUserPopUp").fadeOut();
    } else {
      $("#searcUserPopUp").fadeIn();
    }
  };

  self.onLoadMoreUserProfile = async function () {
    self.page += 1;
    await self.searchByUserNameHelper();
    console.log(this.searchedUserProfiles());
  };
  //

  // helper funcitons
  self.searchByUserNameHelper = async function () {
    const userName = self.searchUserInput();
    const result = await UserProfileService.instance.getProfileBulk(
      self.page,
      self.limit,
      userName
    );
    if (result.flag) {
      const userId = AppManager.instance.appViewModel.userProfile().userId; // current userId
      const filtered = result.data.filter((record) => record.userId != userId); // remove current user from search list
      filtered.forEach((userProfile) => {
        self.searchedUserProfiles.push(userProfile); // Push into the observable array
      });
      if (filtered.length < self.limit) {
        showErrorToast({ text: "end reached ..." });
      }
    } else {
      showErrorToast({ text: result.message });
    }
  };
  //

  self.goToOtherProfile = function (profileId) {
    window.location.hash = `#${SD.pageName.contactprofile}?profileId=${profileId}`;
  };

  self.selectContactProfile = function (profileId) {
    if (self.activContactProfile()?.id == profileId) return; // same page
    const selectedProfil = AppManager.instance.appViewModel
      .contactList()
      .find((p) => p.id == profileId);
    this.activContactProfile(selectedProfil);
    self.messages([]);
  };

  self.sendChat = function () {
    const destUserId = this.activContactProfile().userId;
    const userMessage = $("#chatInput").val();

    AppManager.instance.appViewModel.socket.emit(
      "sendMessage",
      userMessage,
      destUserId
    );
  };

  self.onChatRecieve = function (message, fromUserId) {
    if (self.activContactProfile().userId == fromUserId) {
      self.messages.push(message);
    }
    console.log(self.messages());
  };
}

export default homeViewModel;
