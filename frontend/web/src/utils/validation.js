// src/utils/validation.js

export const validateEmail = (email) => {
  if (!email) return "Email không được để trống";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Email không hợp lệ";
  return null;
};

export const validateUserName = (user_name) => {
  if (!user_name) return "Tên đăng nhập không được để trống";
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!regex.test(user_name)) return "Tên đăng nhập 3-20 ký tự, chỉ gồm chữ, số và dấu _";
  return null;
};

export const validateDisplayName = (display_name) => {
  if (!display_name) return "Tên hiển thị không được để trống";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
  return null;
};

export const validateConfirmPassword = (password, confirm_password) => {
  if (password !== confirm_password) return "Mật khẩu xác nhận không khớp";
  return null;
};

export const validateRegister = (form) => {
  const errors = {};

  const emailError = validateEmail(form.email);
  if (emailError) errors.email = emailError;

  const userNameError = validateUserName(form.user_name);
  if (userNameError) errors.user_name = userNameError;

  const displayNameError = validateDisplayName(form.display_name);
  if (displayNameError) errors.display_name = displayNameError;

  const passwordError = validatePassword(form.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(form.password, form.confirm_password);
  if (confirmPasswordError) errors.confirm_password = confirmPasswordError;

  return errors;
};

export const validateLogin = (form) => {
  const errors = {};
  if (!form.identifier) errors.identifier = "Email hoặc tên đăng nhập không được để trống";
  if (!form.password) errors.password = "Mật khẩu không được để trống";
  return errors;
};

export const validateForgotPassword = (email) => {
  return validateEmail(email);
};
