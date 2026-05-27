import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UpdateSystemService } from "../../services/systemConfig/UpdateSystemService";

// configuração multer para salvar temporariamente
const tmpDir = path.resolve(process.cwd(), "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `logo-temp-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png") return cb(new Error("Apenas PNG permitido"));
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("logo");

class UpdateSystemController {
  async handle(req: Request, res: Response) {
    upload(req, res, async function (err: any) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        const id = req.params.id;
        const body = req.body || {};

        // se arquivo enviado, passa o caminho temporário no payload
        if ((req as any).file && (req as any).file.path) {
          body.logoFilePath = (req as any).file.path;
        }

        const service = new UpdateSystemService();
        const result = await service.execute(id, body);

        return res.json(result);
      } catch (e: any) {
        return res.status(500).json({ error: e.message || "Erro desconhecido" });
      }
    });
  }
}

export { UpdateSystemController };