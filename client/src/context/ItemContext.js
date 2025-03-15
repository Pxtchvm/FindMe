import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const ItemContext = createContext();

export const useItems = () => useContext(ItemContext);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get all items
  const getAllItems = async (filters = {}) => {
    setLoading(true);
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const res = await axios.get(`/api/items?${queryParams.toString()}`);
      setItems(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch items:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user items
  const getUserItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/items/user");
      setUserItems(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch user items:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get item by ID
  const getItemById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/items/${id}`);
      setCurrentItem(res.data);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch item with ID ${id}:`, error);
      setCurrentItem(null);
      throw error; // We need to throw this so the component can catch it
    } finally {
      setLoading(false);
    }
  };

  // Create a new item
  const createItem = async (itemData) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/items", itemData);

      // Update user items list
      setUserItems([res.data.item, ...userItems]);

      return res.data;
    } catch (error) {
      console.error("Failed to create item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an item
  const updateItem = async (id, itemData) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/items/${id}`, itemData);

      // Update item in lists
      if (items.length > 0) {
        setItems(items.map((item) => (item._id === id ? res.data.item : item)));
      }

      if (userItems.length > 0) {
        setUserItems(
          userItems.map((item) => (item._id === id ? res.data.item : item)),
        );
      }

      if (currentItem && currentItem._id === id) {
        setCurrentItem(res.data.item);
      }

      return res.data;
    } catch (error) {
      console.error(`Failed to update item with ID ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`/api/items/${id}`);

      // Remove item from lists
      if (items.length > 0) {
        setItems(items.filter((item) => item._id !== id));
      }

      if (userItems.length > 0) {
        setUserItems(userItems.filter((item) => item._id !== id));
      }

      if (currentItem && currentItem._id === id) {
        setCurrentItem(null);
      }

      return res.data;
    } catch (error) {
      console.error(`Failed to delete item with ID ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Claim an item
  const claimItem = async (id) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/items/${id}/claim`);

      // Update item in lists
      if (items.length > 0) {
        setItems(items.map((item) => (item._id === id ? res.data.item : item)));
      }

      if (currentItem && currentItem._id === id) {
        setCurrentItem(res.data.item);
      }

      return res.data;
    } catch (error) {
      console.error(`Failed to claim item with ID ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Process claim (approve/reject)
  const processClaim = async (id, approve) => {
    setLoading(true);
    try {
      const res = await axios.put(`/api/items/${id}/process-claim`, {
        approve,
      });

      // Update item in lists
      if (items.length > 0) {
        setItems(items.map((item) => (item._id === id ? res.data.item : item)));
      }

      if (userItems.length > 0) {
        setUserItems(
          userItems.map((item) => (item._id === id ? res.data.item : item)),
        );
      }

      if (currentItem && currentItem._id === id) {
        setCurrentItem(res.data.item);
      }

      return res.data;
    } catch (error) {
      console.error(`Failed to process claim for item with ID ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    items,
    userItems,
    currentItem,
    loading,
    getAllItems,
    getUserItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    claimItem,
    processClaim,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export default ItemContext;
