import jwt from "jsonwebtoken";

export function adminAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, process.env.ADMIN_JWT_SECRET);
}
