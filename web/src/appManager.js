import loadView from "./utility/loadView";
import SD from "./utility/SD";
import AppViewModel from "./viewModel/appViewModel";
import LoginViewModel from "./viewModel/loginViewModel";
import RegisterViewModel from "./viewModel/registerViewModel";
import ko from "knockout";
import { jwtDecode } from "jwt-decode";
import homeViewModel from "./viewModel/homeViewModel";
import profileViewModel from "./viewModel/profileViewModel";
import contactProfileViewModel from "./viewModel/contactprofileViewModel";
import contactlistViewModel from "./viewModel/contactlistViewModel";

class AppManager {
  static instance = null;
  constructor() {
    if (!AppManager.instance) {
      AppManager.instance = this;
    } else {
      return AppManager.instance;
    }
  }
  initilize() {
    window.location.hash = `#${SD.pageName.register}`;
    loadView();
    this.appViewModel = new AppViewModel();
    this.appViewModel.changeViewModel("register-view", new RegisterViewModel());
    ko.applyBindings(this.appViewModel);

    // check user is alrady logged in
    const jwtFromLocalStorage = localStorage.getItem("jwt");
    if (jwtFromLocalStorage && this.isJwtValid(jwtFromLocalStorage)) {
      window.location.hash = `#${SD.pageName.home}`;
    }
    window.addEventListener("hashchange", this.router.bind(this));
  }
  router(e) {
    let hash = window.location.hash.replace("#", "");
    const queryParamsString = hash.split("?")[1];
    const params = new URLSearchParams(queryParamsString);
    if (hash.includes("?")) {
      hash = hash.split("?")[0];
    }

    switch (hash) {
      case SD.pageName.login:
        this.appViewModel.changeViewModel("login-view", new LoginViewModel());
        break;
      case SD.pageName.register:
        this.appViewModel.changeViewModel(
          "register-view",
          new RegisterViewModel()
        );
        break;
      case SD.pageName.home:
        this.appViewModel.changeViewModel("home-view", new homeViewModel());
        // fetch inital data
        const self = this;
        async function fetchHelper() {
          if (!self.appViewModel.hasInitialData()) {
            self.appViewModel.appLoader(true);
            await self.appViewModel.fetchInitalData();
            self.appViewModel.hasInitialData(true);
            self.appViewModel.appLoader(false);
          }
        }
        fetchHelper();
        break;
      case SD.pageName.profile:
        this.appViewModel.changeViewModel(
          "profile-view",
          new profileViewModel(this.appViewModel.userProfile())
        );
        break;
      case SD.pageName.contactprofile:
        this.appViewModel.changeViewModel(
          "contactprofile-view",
          new contactProfileViewModel(params.get("profileId")) // send profile id
        );
        break;
      case SD.pageName.contactrequestlist:
        this.appViewModel.changeViewModel(
          "contactrequestlist-view",
          new contactlistViewModel()
        );
        break;
      default:
        this.appViewModel.changeViewModel(
          "register-view",
          new RegisterViewModel()
        );
        break;
    }
  }
  isJwtValid(token) {
    try {
      // Decode the token payload
      const decoded = jwtDecode(token);

      // Check expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.log("JWT is expired");
        return false;
      }

      console.log("JWT is valid:", decoded);
      return true;
    } catch (error) {
      console.error("Invalid JWT:", error);
      return false;
    }
  }
}

export default AppManager;
