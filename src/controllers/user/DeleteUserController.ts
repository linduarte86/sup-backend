import { Request, Response } from "express";
import { DeleteUserService } from "../../services/user/DeleteUserService";

class DeleteUserController {
  async handle(req: Request, res: Response) {
  
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "Parâmetro user_id é obrigatório" });
    }

    const deleteUserService = new DeleteUserService();

    try {
      const user = await deleteUserService.execute({ user_id });

      return res.json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export { DeleteUserController };