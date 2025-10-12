import { Request, Response } from "express";
import { DeleteEquipSevice } from "../../services/equipamento/DeleteEquipService";

class DeleteEquipController {
  async handle(req: Request, res: Response) {

    const { equip_id } = req.params;

    if (!equip_id) {
      return res.status(400).json({ error: "id obrigatório!" });
    }

    const deleteEquipamento = new DeleteEquipSevice();

    try {

      const equip = await deleteEquipamento.execute({ equip_id });
      return res.json(equip);

    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export { DeleteEquipController };