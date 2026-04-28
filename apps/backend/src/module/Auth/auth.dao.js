export const createUser = async (userData) => {
  // Mock DAO implementation
  // return await Auth.create(userData);
  return { _id: "mock_id", ...userData };
};

export const findUserByEmail = async (email) => {
  // Mock DAO implementation
  // return await Auth.findOne({ email });
  if (email === "test@test.com") {
    return { _id: "mock_id", email, password: "hashed_password", name: "Test User" };
  }
  return null;
};
