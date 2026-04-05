import axios from "axios";
import { Template, Purchase } from "../types";

const API_URL = "/api"; // Laravel API base

export const getTemplates = async (): Promise<Template[]> => {
  const { data } = await axios.get(`${API_URL}/templates`);
  return data;
};

export const getTemplateById = async (id: number): Promise<Template> => {
  const { data } = await axios.get(`${API_URL}/templates/${id}`);
  return data;
};

export const createPurchase = async (templateId: number): Promise<Purchase> => {
  const { data } = await axios.post(`${API_URL}/purchases`, {
    template_id: templateId
  });
  return data;
};