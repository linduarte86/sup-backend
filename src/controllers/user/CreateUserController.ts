import { Request, Response } from "express";
import { userSchema, UserData } from "../../schemas/users/usersSchema";
import { CreateUserService } from "../../services/user/CreateUserService";
import { ZodError } from "zod";

class CreateUserController {
  async handle(req: Request, res: Response) {
    try {
      const data = userSchema.parse(req.body) as UserData;

      const createUserService = new CreateUserService();
      const user = await createUserService.execute(data);

      return res.status(201).json(user);

    } catch (error) {

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => issue.message);
        return res.status(400).json({ errors });
      }

      return res.status(500).json({ error: error.message || "Erro interno do servidor" });
    }
  }
}

export { CreateUserController };

