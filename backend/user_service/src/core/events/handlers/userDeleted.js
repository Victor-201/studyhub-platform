export default ({ userRepo }) => async (payload) => {
  await userRepo.deleteUserById(payload.id);
  console.log("[UserService] User deleted from event");
};
