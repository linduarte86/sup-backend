import { Request, Response } from "express";

class LogoutController {
  async handle(req: Request, res: Response) {

    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: '/',
    });

    return res.status(200).json({ message: "Logout realizado com sucesso." });
  }
}

export { LogoutController };