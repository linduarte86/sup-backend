
// Middleware de autenticação.

import { Request, Response, NextFunction, } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string; // id do usuário que tenta logar
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {

  // Receber o token
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(" ")

  try { // validar esse token

    const { sub } = verify(
      token,
      process.env.JWT_SECRET
    ) as Payload; // afirma que será devolvido o tipo Payload

    // recuperar o id do token e cololar dentro de uma variavel user_id dentro do req.
    (req as any).user_id = sub;
    //req.user_id = sub;

    return next();

  } catch (err) {
    return res.status(401).end();
  }

}