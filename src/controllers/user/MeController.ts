import { Request, Response } from "express";
import { MeService } from "../../services/user/MeService";

class MeController {
  async handle(req: Request, res: Response) {

    const user_id = (req as any).user_id;

    const meService = new MeService();

    const user = await meService.execute(user_id);

    return res.json(user);
  }
}

export { MeController };

