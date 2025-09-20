// src/features/auth/authAPI.ts
import axios from 'axios';
import { LoginRequest } from './authTypes';


const BASE_URL = 'https://erp.knestaluform.in/api/method/';

// export const loginAPI = async (data: LoginRequest) => {

export const loginAPI = async ({ usr, pwd }: LoginRequest) => {

  try {
    const response = await axios.get(`${BASE_URL}login`, {
      params: {
        usr: usr,
        pwd: pwd,
      },
    });


    return response.data;
  } catch (error: any) {

        console.log("login", error)
    if (error.response && error.response.data) {
     
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {

      throw new Error('No response from server');
    } else {

      throw new Error(error.message || 'Unexpected error');
    }
  }
};
