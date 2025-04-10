// src/api/authApi.ts

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(message: string, status: number, body: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export const loginUser = async (
  email: string,
  password: string,
  role?: string
) => {
  const url = "http://localhost:5000/api/auth/login";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data.error || data.message || "Login failed", response.status, data);
  }
  return data;
};

export const registerUser = async (
  email: string,
  password: string,
  role: string,
  confirmRoleAddition: boolean = false
) => {
  const url = "http://localhost:5000/api/auth/register";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role, confirmRoleAddition }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(
      data.message || data.error || "Signup failed",
      response.status,
      data
    );
  }
  return data;
};

export const checkEmail = async (email: string) => {
  const url = "http://localhost:5000/api/auth/check-email";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data.error || "Email check failed", response.status, data);
  }
  return data; // { exists: boolean }
};
