import { Request, Response } from "express";
import { ReadUserService } from "../../services/user/ReadUserService";

class ReadUserController {

  async handle(req: Request, res: Response) {
    
    const readUserService = new ReadUserService();

    const users = await readUserService.execute();

    return res.json(users);
  }

}
export { ReadUserController };

