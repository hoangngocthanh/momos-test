import requestHandler from "@configs/axios-client";

export const loginByEmailApi = (email: string, password: string) => {
  return requestHandler({
    url: "/auth/login",
    method: "POST",
    data: {
      email,
      password,
    },
  });
};

export const signUpByEmailApi = async (email: string, password: string) => {
  return requestHandler({
    url: "/auth/signup",
    method: "POST",
    data: {
      email,
      password,
    },
  });
};
