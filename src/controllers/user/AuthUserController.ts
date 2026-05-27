import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authUserService = new AuthUserService();

    const auth = await authUserService.execute({
      email,
      password,
    });

    const expressTime = 60 * 60 * 24 * 30; // 30 dias

    res.cookie("session", auth.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: expressTime * 1000,
      path: "/",
    });

    return res.json({
      id: auth.id,
      name: auth.name,
      email: auth.email,
      nivel: auth.nivel,
      permissions: auth.permissions,
    });
  }
}

export { AuthUserController }