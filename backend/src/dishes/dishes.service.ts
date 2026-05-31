import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.dish.findMany({
      include: { seller: { select: { id: true, firstName: true, lastName: true, city: true } }, category: true, reviews: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: { seller: { select: { id: true, firstName: true, lastName: true, city: true } }, category: true, reviews: true },
    });
  }

  findBySeller(sellerId: number) {
    return this.prisma.dish.findMany({
      where: { sellerId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any, sellerId: number) {
    await this.ensureActiveSeller(sellerId);
    return this.prisma.dish.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        imageUrl: data.imageUrl,
        quantity: Number(data.quantity || 1),
        city: data.city,
        allergens: data.allergens,
        preparationTime: data.preparationTime ? Number(data.preparationTime) : null,
        sellerId,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        availability: data.availability === undefined ? true : Boolean(data.availability),
      },
    });
  }

  async update(id: number, data: any, sellerId: number) {
    await this.ensureActiveSeller(sellerId);
    await this.ensureOwner(id, sellerId);
    return this.prisma.dish.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price === undefined ? undefined : Number(data.price),
        imageUrl: data.imageUrl,
        quantity: data.quantity === undefined ? undefined : Number(data.quantity),
        city: data.city,
        allergens: data.allergens,
        preparationTime:
          data.preparationTime === undefined || data.preparationTime === ''
            ? undefined
            : Number(data.preparationTime),
        categoryId:
          data.categoryId === undefined || data.categoryId === ''
            ? undefined
            : Number(data.categoryId),
        availability:
          data.availability === undefined ? undefined : Boolean(data.availability),
      },
    });
  }

  async remove(id: number, sellerId: number) {
    await this.ensureActiveSeller(sellerId);
    await this.ensureOwner(id, sellerId);
    return this.prisma.dish.delete({ where: { id } });
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
    const dish = await this.prisma.dish.findUnique({ where: { id } });
    if (!dish) {
      throw new NotFoundException('Plat introuvable');
    }
    if (dish.sellerId !== sellerId) {
      throw new ForbiddenException('Action interdite sur ce plat');
    }
    return dish;
  }
}
