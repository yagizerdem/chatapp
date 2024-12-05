interface IUserCredentials {
  lastName: string;
  firstName: string;
  email: string;
  id: number;
  jwt: string;
}

class UserCredentials {
  lastName: string;
  firstName: string;
  email: string;
  id: number;
  jwt: string;
  constructor(userCredentials: IUserCredentials) {
    this.firstName = userCredentials.firstName;
    this.lastName = userCredentials.lastName;
    this.email = userCredentials.email;
    this.id = userCredentials.id;
    this.jwt = userCredentials.jwt;
  }
}

export default UserCredentials;
