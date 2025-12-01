import jwt from 'jsonwebtoken';

const secret = "4e0f5f0b11c6dc9e571b996bde5d16566757666038a40606b558599e6ce94594";

const payload = {
  user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  display_name: "user01",
  role: "admin"
};

// không set expiresIn → token sẽ vô hạn
const token = jwt.sign(payload, secret);

console.log("Token test:", token);
