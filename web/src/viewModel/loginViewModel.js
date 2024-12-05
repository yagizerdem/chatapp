import ko from "knockout";
import $ from "jquery";
import LogInModel from "../model/logInModel";
import AuthService from "../service/authService";
import { showErrorToast, showSuccessToast } from "../utility/toast";

function LoginViewModel() {
  const self = this;
  self.isLoading = ko.observable(false);

  self.onLogin = async function () {
    var data = $("#loginForm")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    self.isLoading(true);
    const logInModel = new LogInModel({
      email: data.email,
      password: data.password,
    });
    const loginResult = await AuthService.instance.login(logInModel);
    self.isLoading(false);

    if (!loginResult.success) {
      showErrorToast({ text: loginResult.message });
      return;
    }
    showSuccessToast({ text: loginResult.message });
    const payload = loginResult.payload;
    const { firstName, lastName, email, jwt, id: userid } = payload; // set this to local storage
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("email", email);
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("userid", userid);

    window.location.hash = "#home";
  };
}

export default LoginViewModel;
