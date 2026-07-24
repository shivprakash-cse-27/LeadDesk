const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const parseResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  
  if (!res.ok) {
    const error = new Error(data?.message || res.statusText || 'API Error');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const apiGet = async (endpoint) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return parseResponse(res);
};

export const apiPost = async (endpoint, body) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return parseResponse(res);
};

export const apiPatch = async (endpoint, body) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return parseResponse(res);
};
