
declare namespace Express {
  export interface Request {
    user_id: string;
  }
}
  

/*
// src/@types/express/index.d.ts
import "express";

declare module "express" {
  export interface Request {
    user_id: string;
  }
}
*/

/*
no tsconfig.json, descomentar o typeRoots e informar o caminho

"typeRoots": [
    "./src/@types"
  ],  
*/