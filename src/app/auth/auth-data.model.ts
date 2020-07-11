// auth data model - NOT user model
//    we do NOT want the password attached to the user all the time
//    and we do NOT want the password sitting around on the front-end for too long

// AuthData is used for submitting the user data to the backend,
//    other user actions will be handled with a separate model
export interface AuthData {
  email: string;
  password: string;
}
