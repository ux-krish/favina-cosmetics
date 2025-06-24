// Simulated auth service that would normally make API calls
export const loginUser = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would be an API call
  return {
    ...credentials,
    firstName: 'John',
    lastName: 'Doe',
    id: '123',
  };
};

export const registerUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would be an API call
  return {
    ...userData,
    id: '123',
  };
};