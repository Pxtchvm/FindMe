// src/services/auth.service.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

class AuthService {
  async login(universityId, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        universityId,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        universityId: userData.universityId,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        mobileNumber: userData.mobileNumber,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      return new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      // Request made but no response
      return new Error("No response from server");
    } else {
      // Error setting up request
      return new Error("Error setting up request");
    }
  }
}

export default new AuthService();
