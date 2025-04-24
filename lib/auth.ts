import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/index";

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (e) {
    console.error("Error saving token", e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (e) {
    console.error("Error retrieving token", e);
    return null;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("Content-Type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.warn("Non-JSON response:", text);
      return null;
    }

    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const signup = async (username: string, password: string) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("Content-Type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const text = await res.text();
      console.warn("Non-JSON response:", text);
      return null;
    }

    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error("Signup error:", error);
    return null;
  }
};
