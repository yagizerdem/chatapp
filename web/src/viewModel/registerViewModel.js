import ko from "knockout";
import $ from "jquery";
import AuthService from "../service/authService";
import RegisterModel from "../model/registerModel";
import { showErrorToast, showSuccessToast } from "../utility/toast";
function RegisterViewModel() {
  const self = this;
  self.isLoading = ko.observable(false);

  self.onRegister = async function () {
    var data = $("#registerForm")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    self.isLoading(true);
    const registerModel = new RegisterModel({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });

    const registerResult = await AuthService.instance.register(registerModel);
    self.isLoading(false);

    if (!registerResult.success) {
      showErrorToast({ text: registerResult.message });
      console.log("girdi");
      return;
    }
    showSuccessToast({ text: registerResult.message });
    window.location.hash = "#login";
  };
}

export default RegisterViewModel;
