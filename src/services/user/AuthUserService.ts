
import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { permission } from "process";

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthRequest) {
    // verificar se o email existe
    const user = await prismaClient.user.findFirst({
      where: {
        email: email
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!user) {
      throw new Error("User/password incorrect")
    }

    // verificar se a senha está correta
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("User/password incorrect")
    }

    // Se deu tudo certo, vamos gerar o token paro o usuário
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não está definido");
    }

    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET, //em tsconfig, setar strict como false
      {
        subject: user.id,
        expiresIn: '30d'
      }
    )

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      nivel: user.nivel,
      permissions:
        user.permissions?.map(
          item => item.permission.key
        ),
      token: token
    }
  }
}

export { AuthUserService };