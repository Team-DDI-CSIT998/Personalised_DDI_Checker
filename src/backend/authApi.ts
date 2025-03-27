export const loginUser = async (email: string, password: string) => {
  const url = "http://localhost:5001/api/auth/login";
  const requestData = {
    email,
    password,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Login failed");
  }

  return await response.json();
};

export const registerUser = async (username: string, email: string, password: string) => {
  const url = "http://localhost:5001/api/auth/register";
  const requestData = {
    username,
    email,
    password,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Signup failed");
  }

  return await response.json();
};
