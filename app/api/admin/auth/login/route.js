import jwt from "jsonwebtoken";
import { ADMIN_CREDENTIALS } from "@/lib/config/admins";

export async function POST(req) {
  const { username, password } = await req.json();

  let department = null;

  for (const [dept, creds] of Object.entries(ADMIN_CREDENTIALS)) {
    if (creds.username === username && creds.password === password) {
      department = dept;
      break;
    }
  }

  if (!department) {
    return Response.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { role: "admin", department },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "1d" }
  );

  return Response.json({
    message: "Login successful",
    token,
    department,
  });
}
