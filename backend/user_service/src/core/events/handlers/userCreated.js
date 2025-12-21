export default ({ userRepo }) => async (payload) => {
  await userRepo.createUser(payload);

  console.log("[UserService] User created from event");
};
