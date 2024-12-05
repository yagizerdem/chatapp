import $ from "jquery";
import registerView from "bundle-text:../view/register.html";
import logInView from "bundle-text:../view/logIn.html";
import homeView from "bundle-text:../view/home.html";
import profileView from "bundle-text:../view/profile.html";
import contactprofileView from "bundle-text:../view/contactprofile.html";
import contactrequestlistView from "bundle-text:../view/contactrequestlist.html";

function loadView() {
  const documentBody = $("#body");

  documentBody.append(registerView);
  documentBody.append(logInView);
  documentBody.append(homeView);
  documentBody.append(profileView);
  documentBody.append(contactprofileView);
  documentBody.append(contactrequestlistView);
}

export default loadView;
