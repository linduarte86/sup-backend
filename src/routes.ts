import { Router } from "express";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { ReadUserController } from "./controllers/user/ReadUserController";
import { DeleteUserController } from "./controllers/user/DeleteUserController";
import { UpdateUserController } from "./controllers/user/UpdateUserController";
import { CreateEquipController } from "./controllers/equipamento/CreateEquipController";
import { ReadEquipController } from "./controllers/equipamento/ReadEquipController";
import { UpdateEquipController } from "./controllers/equipamento/UpdateEquipController";
import { DeleteEquipController } from "./controllers/equipamento/DeleteEquipController";
import { ContatosController } from "./controllers/contato/CreateContatosController";
import { ReadContatosController } from "./controllers/contato/ReadContatosController";
import { DeleteContatoscontroller } from "./controllers/contato/DeleteContatosController";
import { UpdateContatosController } from "./controllers/contato/UpdateContatosController";
import { ReadTimejobController } from "./controllers/timejob/readTimejobController";
import { UpdateTimejobController } from "./controllers/timejob/updateTimejobController";
import { ReadTempoMensagemController } from "./controllers/tempoEnvioMensagem/readTempoMensagemController";
import { UpdateTempoMensagemController } from "./controllers/tempoEnvioMensagem/updateTempoMensagemController";
import { ReadLogsController } from "./controllers/logs/readLogsController";
import { DeleteLogsController } from "./controllers/logs/deleteLogsController";

const router = Router();

// Rotas abaixo.

//--ROTAS DE USUÁRIOS
router.post('/users', isAuthenticated, new CreateUserController().handle);
router.post('/auth/login', new AuthUserController().handle);
router.get('/users', isAuthenticated, new ReadUserController().handle);
router.put('/users/:user_id', isAuthenticated, new UpdateUserController().handle);
router.delete('/users/:user_id', isAuthenticated, new DeleteUserController().handle);

//--ROTAS DE EQUIPAMENTOS
router.post('/equipamentos', isAuthenticated, new CreateEquipController().handle);
router.get('/equipamentos', isAuthenticated, new ReadEquipController().handle);
router.put('/equipamentos/:equip_id', isAuthenticated, new UpdateEquipController().handle);
router.delete('/equipamentos/:equip_id', isAuthenticated, new DeleteEquipController().handle);

//--ROTAS DE CONTATOS
router.post('/contatos', isAuthenticated, new ContatosController().handle);
router.get('/contatos', isAuthenticated, new ReadContatosController().handle);
router.put('/contatos/:contato_id', isAuthenticated, new UpdateContatosController().handle);
router.delete('/contatos/:contato_id', isAuthenticated, new DeleteContatoscontroller().handle);

//--ROTAS DE TIMEJOB
router.get('/timejob', isAuthenticated, new ReadTimejobController().handle);
router.put('/timejob/:id', isAuthenticated, new UpdateTimejobController().handle);

//--ROTAS DE TEMPO DE ENVIO DE MENSAGENS
router.get('/tempo-mensagem', isAuthenticated, new ReadTempoMensagemController().handle);
router.put('/tempo-mensagem/:id', isAuthenticated, new UpdateTempoMensagemController().handle);

//--ROTAS DE LOGS
router.get('/logs', isAuthenticated, new ReadLogsController().handle);
router.delete('/logs/:log_id', isAuthenticated, new DeleteLogsController().handle);


export { router };