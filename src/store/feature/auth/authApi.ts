// src/features/auth/authAPI.ts
import axios from 'axios';
import { LoginRequest } from './authTypes';


const BASE_URL = 'http://172.16.3.1:8000/api/method/';

// export const loginAPI = async (data: LoginRequest) => {

export const loginAPI = async ({ usr, pwd }: LoginRequest) => {
  const dummyUser = {
    usr: 'testuser',
    pwd: 'test123', 

  };


    await new Promise((resolve) => setTimeout(resolve, 1000));
      if (usr === dummyUser.usr && pwd === dummyUser.pwd) {
    return dummyUser;
  } else {
    throw new Error('Invalid username or password');
  }
  // try {
  //   const response = await axios.get(`${BASE_URL}login`, {
  //     params: {
  //       usr: data.usr,
  //       pwd: data.pwd,
  //     },
  //   });


  //   return response.data;
  // } catch (error: any) {

  //       console.log("login", error)
  //   if (error.response && error.response.data) {
     
  //     throw new Error(error.response.data.message || 'Login failed');
  //   } else if (error.request) {

  //     throw new Error('No response from server');
  //   } else {

  //     throw new Error(error.message || 'Unexpected error');
  //   }
  // }
};
