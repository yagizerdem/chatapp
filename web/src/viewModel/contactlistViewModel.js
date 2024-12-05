import ko from "knockout";
import $ from "jquery";
import { showErrorToast, showSuccessToast } from "../utility/toast";
import AppManager from "../appManager";
import AuthService from "../service/authService";
import UserProfileService from "../service/userProfileService";
import ContactService from "../service/contactService";

function contactlistViewModel() {
  const self = this;
  self.isLoading = false;

  self.page = 1;
  self.limit = 5;
  self.isEnd = false;
  self.data = ko.observableArray([]);

  self.logout = function () {
    AuthService.instance.logout();
  };

  self.onLoadMore = async function () {
    if (self.isEnd) {
      showSuccessToast({ text: "no more contact request data left ..." });
      return;
    }
    const response = await ContactService.instance.loadContactRequest(
      self.page,
      self.limit
    );
    if (!response.flag) {
      showErrorToast({ text: response.message });
    } else {
      showSuccessToast({ text: response.message });
      if (response.data.length < self.limit) {
        showSuccessToast({ text: "end reached" });
        self.isEnd = true;
      }
      self.page++;
    }
    response.data.forEach((element) => {
      self.data.push(element);
    });
    console.log("vm", self.data());
  };

  self.reject = async function (requestId) {
    const response = await ContactService.instance.reject(requestId);
    if (!response.flag) {
      showErrorToast({ text: response.message });
    } else {
      showSuccessToast({ text: response.message });
    }
  };

  self.accept = async function (requestId) {
    const result = await ContactService.instance.accept(requestId);
  };
}

export default contactlistViewModel;
