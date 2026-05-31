import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.formation.findMany({
      where: { availability: true },
      include: { seller: { select: { id: true, firstName: true, lastName: true, city: true, sellerD17PhoneNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.formation.findUnique({
      where: { id },
      include: { seller: { select: { id: true, firstName: true, lastName: true, city: true, sellerD17PhoneNumber: true } } },
    });
  }

  findBySeller(sellerId: number) {
    return this.prisma.formation.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any, sellerId: number) {
    await this.ensureActiveSeller(sellerId);
    return this.prisma.formation.create({
      data: {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        duration: data.duration,
        level: data.level,
        imageUrl: data.imageUrl,
        availability: data.availability === undefined ? true : Boolean(data.availability),
        sellerId,
      },
    });
  }

  async update(id: number, data: any, sellerId: number) {
    await this.ensureActiveSeller(sellerId);
    await this.ensureOwner(id, sellerId);
    return this.prisma.formation.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price === undefined ? undefined : Number(data.price),
        duration: data.duration,
        level: data.level,
        imageUrl: data.imageUrl,
        availability:
          data.availability === undefined ? undefined : Boolean(data.availability),
      },
    });
  }

  async remove(id: number, sellerId: number) {
    await this.ensureActiveSeller(sellerId);
    await this.ensureOwner(id, sellerId);
    return this.prisma.formation.delete({ where: { id } });
  }

  private async ensureActiveSeller(sellerId: number) {
    const seller = await this.prisma.user.findUnique({
      where: { id: sellerId },
      select: { role: true, sellerSubscriptionStatus: true, sellerSubscriptionExpiresAt: true },
    });
    const expiresAt = seller?.sellerSubscriptionExpiresAt?.getTime() ?? 0;
    if (!seller || seller.role !== 'SELLER' || seller.sellerSubscriptionStatus !== 'ACTIVE' || expiresAt <= Date.now()) {
      throw new ForbiddenException('Abonnement vendeur requis');
    }
  }

  private async ensureOwner(id: number, sellerId: number) {
    const formation = await this.prisma.formation.findUnique({ where: { id } });
    if (!formation) {
      throw new NotFoundException('Formation introuvable');
    }
    if (formation.sellerId !== sellerId) {
      throw new ForbiddenException('Action interdite sur cette formation');
    }
    return formation;
  }
}
