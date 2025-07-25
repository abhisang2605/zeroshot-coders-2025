import axios from 'axios';
import { CodebaseInput, AnalysisResult } from '../types';

// Configure the base URL for your Python backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const analyzeCodebase = async (input: CodebaseInput): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    
    // Add the input type
    formData.append('type', input.type);
    
    // Add file if it exists
    if (input.file) {
      formData.append('file', input.file);
    }
    
    // Add URL if it exists
    if (input.url) {
      formData.append('url', input.url);
    }
    
    // Add optional fields
    if (input.additionalPrompt) {
      formData.append('additionalPrompt', input.additionalPrompt);
    }
    
    if (input.summary) {
      formData.append('summary', input.summary);
    }
    
    // Add analysis options
    formData.append('options', JSON.stringify(input.options));
    
    const response = await api.post('/analyze', formData);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle different types of errors
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid input provided');
      } else if (error.response?.status === 415) {
        throw new Error('Unsupported file type. Only Python codebases are supported.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred during analysis');
      } else {
        throw new Error(error.response?.data?.detail || 'Network error occurred');
      }
    }
    
    throw new Error('An unexpected error occurred');
  }
};

export const getAnalysisStatus = async (analysisId: string): Promise<AnalysisResult> => {
  try {
    const response = await api.get(`/analysis/${analysisId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to get analysis status');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const downloadResult = async (analysisId: string, resultType: string): Promise<Blob> => {
  try {
    const response = await api.get(`/download/${analysisId}/${resultType}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to download result');
    }
    throw new Error('An unexpected error occurred');
  }
};