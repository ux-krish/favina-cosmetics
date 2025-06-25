// Simulated auth service that would normally make API calls
export const loginUser = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if user exists in localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const found = users.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  if (!found) {
    // Only throw error for login
    throw new Error('Invalid email or password');
  }
  // Return user data (omit password)
  const { password, ...userWithoutPassword } = found;
  return userWithoutPassword;
};

export const registerUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(u => u.email === userData.email)) {
    // Only throw user exists error, do not throw login error
    throw new Error('User already exists');
  }
  const newUser = {
    ...userData,
    id: Date.now().toString(),
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  // Return user data (omit password)
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};