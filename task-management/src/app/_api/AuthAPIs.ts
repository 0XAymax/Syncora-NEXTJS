import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const LOGIN_API = `${API_URL}/api/auth/login`;
const CHECK_EMAIL_API = `${API_URL}/api/auth/emailCheck`;
const REGISTER_API = `${API_URL}/api/auth/register`;
const VERIFY_API = `${API_URL}/api/auth/verify`;

export const verifyAPI = async (token: string) => {
  const response = await axios.post(
    VERIFY_API,
    {
      token: token,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const loginAPI = async (email: string, password: string) => {
  const response = await axios.post(LOGIN_API, {
    email: email,
    password: password,
  });
  return response;
};

export const checkEmailAPI = async (email: string) => {
  const response = await axios.post(CHECK_EMAIL_API, { email });
  return response;
};

export const registerAPI = async (
  email: string,
  name: string,
  lastName: string,
  password: string,
  avatarUrl?:string,
) => {
  const response = await axios.post(REGISTER_API, {
    name,
    lastName,
    email,
    password,
    avatarUrl,
  });
  return response;
};
