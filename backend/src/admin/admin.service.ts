import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [users, orders, dishes, formations, revenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.dish.count(),
      this.prisma.formation.count(),
      this.prisma.order.aggregate({ _sum: { totalPrice: true } }),
    ]);

    return {
      users,
      orders,
      dishes,
      formations,
      revenue: revenue._sum.totalPrice ?? 0,
    };
  }

  users() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        role: true,
        emailVerified: true,
        sellerSubscriptionStatus: true,
        sellerSubscriptionExpiresAt: true,
        sellerSubscriptionReference: true,
        sellerSubscriptionProof: true,
        sellerD17PhoneNumber: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  orders() {
    return this.prisma.order.findMany({
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        items: {
          include: {
            dish: { select: { id: true, name: true } },
            formation: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  dishes() {
    return this.prisma.dish.findMany({
      include: { seller: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  formations() {
    return this.prisma.formation.findMany({
      include: { seller: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateUserRole(id: number, role: Role) {
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException('Role invalide');
    }
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });
  }

  verifyUser(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
      select: { id: true, email: true, emailVerified: true },
    });
  }

  async confirmSellerSubscription(id: number) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    return this.prisma.user.update({
      where: { id },
      data: {
        role: Role.SELLER,
        sellerSubscriptionStatus: 'ACTIVE',
        sellerSubscriptionExpiresAt: expiresAt,
      },
      select: {
        id: true,
        email: true,
        role: true,
        sellerSubscriptionStatus: true,
        sellerSubscriptionExpiresAt: true,
      },
    });
  }

  supportTickets() {
    return this.prisma.supportTicket.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, role: true },
        },
        repliedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async replySupportTicket(id: number, adminId: number, reply: string) {
    const cleanReply = String(reply || '').trim();
    if (!cleanReply) {
      throw new BadRequestException('Reponse obligatoire');
    }

    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { user: { select: { id: true } } },
    });
    if (!ticket) {
      throw new NotFoundException("Demande d'aide introuvable");
    }

    const updated = await this.prisma.supportTicket.update({
      where: { id },
      data: {
        reply: cleanReply,
        repliedById: adminId,
        repliedAt: new Date(),
        status: 'ANSWERED',
        readByAdmin: true,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, role: true },
        },
        repliedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    await this.prisma.clientNotification.create({
      data: {
        clientId: ticket.user.id,
        title: "Reponse de l'admin",
        message: `Votre demande #${ticket.id} a recu une reponse: ${cleanReply.slice(0, 140)}`,
      },
    });

    return updated;
  }

  deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  deleteOrder(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }

  deleteDish(id: number) {
    return this.prisma.dish.delete({ where: { id } });
  }

  deleteFormation(id: number) {
    return this.prisma.formation.delete({ where: { id } });
  }
}
