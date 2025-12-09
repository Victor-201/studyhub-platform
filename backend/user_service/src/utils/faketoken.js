import jwt from 'jsonwebtoken';

const secret = "4e0f5f0b11c6dc9e571b996bde5d16566757666038a40606b558599e6ce94594";

const payload = {
  id: "11111111-2222-4222-8222-111111111112",
  display_name: "user01",
  role: "admin"
};

// không set expiresIn → token sẽ vô hạn
const token = jwt.sign(payload, secret);

console.log("Token test:", token);
