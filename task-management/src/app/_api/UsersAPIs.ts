import axios from "axios";
import {updateUserRequest} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const GET_USERS_FROM_EMAIL_API = `${API_URL}/api/user/email`;
const GET_USER_DETAILS_API = `${API_URL}/api/user/UserDetails`;
const UPDATE_USER_DETAILS_API = `${API_URL}/api/user/UpdateDetails`;
const DELETE_USER_ACCOUNT_API = `${API_URL}/api/user/DeleteAccount`;
export const getUsersFromEmailAPI = async (email: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    GET_USERS_FROM_EMAIL_API,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Response from getUsersFromEmailAPI:", response.data);
  return response.data;
};

export const getUserDetailsAPI=async() =>{
    const token = localStorage.getItem("token");
    const response = await axios.post(
        GET_USER_DETAILS_API,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
    console.log("Response from getUserDetailsAPI:", response.data);
    return response.data;
}

export const updateUserDetailsAPI=async(user : updateUserRequest) =>{
    const token = localStorage.getItem("token");
    const response = await axios.put(
            UPDATE_USER_DETAILS_API,
        {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            avatarUrl: user.avatarUrl,
        },
        {
             headers :{
                 Authorization: `Bearer ${token}`,
             }
        }
    )

    return response.data;
}

export const deleteUserAccountAPI=async() =>{
    const token = localStorage.getItem("token");
    const response = await axios.delete(DELETE_USER_ACCOUNT_API,{
        headers :{
            Authorization: `Bearer ${token}`,
        }
    });
    console.log("Response from deleteAccountAccountAPI:", response.data);
    return response.data;
}