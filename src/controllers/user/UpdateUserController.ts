import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";
import { userUpdateSchema } from "../../schemas/users/userUpdateSchema";
import { ZodError } from "zod";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { user_id } = req.params; // via rota /users/:user_id
    const data = req.body;

    const updateUserService = new UpdateUserService();

    try {

      const validatedData = userUpdateSchema.parse(data);

      const updateUsers = await updateUserService.execute(user_id, validatedData);

      return res.json(updateUsers);

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);

        return res.status(400).json({ errors });
      }

      return res.status(500).json({ error: error.message || "Erro inesperado" });
    }
  }
}

export { UpdateUserController };
