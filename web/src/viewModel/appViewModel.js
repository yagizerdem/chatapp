import ko from "knockout";
import UserProfileService from "../service/userProfileService";
import ContactService from "../service/contactService";
import { io } from "socket.io-client";
import homeViewModel from "./homeViewModel";

function AppViewModel() {
  const self = this;
  self.currentViewState = ko.observable({
    viewName: "",
    viewModel: null,
  });
  self.appLoader = ko.observable(false);

  // fetch one time on app start
  self.hasInitialData = ko.observable(false);
  self.userProfile = ko.observable(null);
  self.contactList = ko.observableArray();
  self.socket = null;

  self.changeViewModel = function (viewName, viewModel) {
    self.currentViewState({
      viewName: viewName,
      viewModel: viewModel,
    });
  };

  // fetch one time on app start
  self.fetchInitalData = async function () {
    // user profile
    const result = await UserProfileService.instance.getOwnProfile();
    this.userProfile(result);
    //
    // fetch contacts
    const allContacts = await ContactService.instance.getContacts();
    self.contactList(allContacts);
    console.log(allContacts);
    //

    // conenct websocksts
    const jwt = window.localStorage.getItem("jwt");
    self.socket = io("http://localhost:3000", {
      extraHeaders: {
        Authorization: `Bearer ${jwt}`, // Send the JWT token as a Bearer token
      },
    });
    self.socket.connect();
    self.registerSocketCallbacks();
  };

  self.registerSocketCallbacks = function () {
    self.socket.on("connect", () => {
      console.log("Successfully connected to the server!");
      console.log("Socket ID:", self.socket.id); // Logs the unique socket ID
    });

    self.socket.on("recieveChat", (message, fromUserId) => {
      if (self.currentViewState().viewModel instanceof homeViewModel) {
        self.currentViewState().viewModel.onChatRecieve(message, fromUserId);
      }
    });

    // custom event listerner
  };
}

export default AppViewModel;
