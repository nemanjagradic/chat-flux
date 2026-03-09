export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  username: string;
  photo?: string;
};

export type SigninData = {
  email: string;
  password: string;
};

export type SignupData = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type SearchedUser = {
  _id: string;
  name: string;
  username: string;
  photo?: string;
};
