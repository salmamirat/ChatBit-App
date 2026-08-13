import api from "./api";

export async function registerUser(fullName, email, password) {
  const response = await api.post("/auth/register", {
    full_name: fullName,
    email,
    password
  });

  return response.data;
}

export async function loginUser(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password
  });

  return response.data;
}

export async function getMyProfile() {
  const response = await api.get("/users/me");

  return response.data;
}