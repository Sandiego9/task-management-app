import axios from "axios";
import type { AuthenticatedUser } from "@/types/user";

const baseUrl = import.meta.env.VITE_TASKS_API_BASE_URL;

// export const fetchUser = async (): Promise<AuthenticatedUser> => {
//   const response = await axios.get(`${baseUrl}/user`);
//   return response.data;
// };

// export const updateUser = async (
//   updatedUser: AuthenticatedUser
// ): Promise<AuthenticatedUser> => {
//   const res = await axios.put(`${baseUrl}/user`, updatedUser);
//   return res.data;
// };

const userServices = {
  async fetchUser(id: string): Promise<AuthenticatedUser | null> {
    try {
      const { data } = await axios.get(`${baseUrl}/users/${id}`);
      return data as AuthenticatedUser;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  async createUser(newUser: AuthenticatedUser): Promise<AuthenticatedUser> {
    try {
      const { data } = await axios.post(`${baseUrl}/users`, newUser);
      return data as AuthenticatedUser;
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
  },

  async updateUser(
    id: string,
    updatedUser: Omit<AuthenticatedUser, "id">
  ): Promise<AuthenticatedUser> {
    try {
      const { data } = await axios.put(`${baseUrl}/users/${id}`, updatedUser);
      return data as AuthenticatedUser;
    } catch (error) {
      console.error("Failed to update user", error);
      throw error;
    }
  },
};

export default userServices;
