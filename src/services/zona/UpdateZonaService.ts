import prismaClient from "../../prisma";

class UpdateZonaService {
  async execute(equipamentoId: string, zonas: { numeroCanal: number; name: string }[]) {
    const updatePromises = zonas.map(zona =>
      prismaClient.zonas.updateMany({
        where: { equipamentoId : equipamentoId, numeroCanal: zona.numeroCanal },
        data: { name: zona.name },
      })
    );

    await Promise.all(updatePromises);

    return { message: "Zonas atualizadas com sucesso" };
  }
}

export { UpdateZonaService };
