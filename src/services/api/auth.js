const BASE_URL = process.env.REACT_APP_API_V1_AUTH_BASE_URL;

export async function loginUser({ username, password }) {
  const response = await fetch(`${BASE_URL}sessions/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciais inválidas');
  }

  return response.json();
}

export async function registerUser({ username, password }) {
  const response = await fetch(`${BASE_URL}sessions/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  console.log(response);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json(); 
}
export async function resetPassword({ email, token, password }) {
  const response = await fetch(`${BASE_URL}sessions/reset-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error.message);
  }

  return response.json(); 
}

export async function forgotPassword({ email }) {
  const response = await fetch(`${BASE_URL}sessions/forgot-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error(error.message);
  }

  return response.json(); 
}