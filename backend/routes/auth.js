import * as express from "express";
import { loginUser } from '../data/supabase/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Response: { user, session } o { error }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({
      error: "Email y password son requeridos",
    });
  }

  const result = await loginUser(email, password);

  if (!result) {
    return res.status(401).json({
      error: "Credenciales inválidas",
    });
  }

  res.json(result);
});

export default router;
