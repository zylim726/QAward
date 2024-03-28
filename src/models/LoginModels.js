// interface LoginResponse {
//   success: boolean;
//   token: string | null;
//   accesslevel: string | null;
//   username: string | null;
//   message: string;
// }

// const LoginModel = {
//   processResponseData(response: any): LoginResponse {
//     if (response.data.success) {
//       return {
//         success: response.data.success,
//         token: response.data.accessToken,
//         accesslevel: response.data.accesslevel,
//         username: response.data.username,
//         message: response.message,
//       };
//     } else {
//       throw new Error(response.data.message);
//     }
//   },
// };

// export default LoginModel;
