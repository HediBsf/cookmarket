import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  findBySeller(sellerId: number) {
    return this.prisma.notification.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  findByClient(clientId: number) {
    return this.prisma.clientNotification.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  unreadCount(sellerId: number) {
    return this.prisma.notification.count({
      where: { sellerId, read: false },
    }).then((count) => ({ count }));
  }

  clientUnreadCount(clientId: number) {
    return this.prisma.clientNotification.count({
      where: { clientId, read: false },
    }).then((count) => ({ count }));
  }

  markRead(id: number, sellerId: number) {
    return this.prisma.notification.updateMany({
      where: { id, sellerId },
      data: { read: true },
    });
  }

  markClientRead(id: number, clientId: number) {
    return this.prisma.clientNotification.updateMany({
      where: { id, clientId },
      data: { read: true },
    });
  }

  markClientUnread(id: number, clientId: number) {
    return this.prisma.clientNotification.updateMany({
      where: { id, clientId },
      data: { read: false },
    });
  }

  deleteClientNotification(id: number, clientId: number) {
    return this.prisma.clientNotification.deleteMany({
      where: { id, clientId },
    });
  }

  async notifyNewOrder(params: {
    sellerId: number;
    orderId: number;
    customerName: string;
    total: number;
    paymentMethod: string;
  }) {
    return this.prisma.notification.create({
      data: {
        sellerId: params.sellerId,
        orderId: params.orderId,
        title: 'Nouvelle commande',
        message: `Commande #${params.orderId} de ${params.customerName} - ${params.total.toFixed(2)} DT (${params.paymentMethod}).`,
      },
    });
  }

  async notifyCustomerOrderStatus(params: {
    orderId: number;
    clientId: number;
    status: string;
  }) {
    return this.prisma.clientNotification.create({
      data: {
        clientId: params.clientId,
        orderId: params.orderId,
        title: 'Statut de commande',
        message: `Votre commande #${params.orderId} est maintenant: ${this.getOrderStatusLabel(params.status)}.`,
      },
    });
  }

  private getOrderStatusLabel(status: string) {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      ACCEPTED: 'Acceptee par le vendeur',
      PREPARING: 'En preparation',
      READY: 'Prete',
      DELIVERING: 'En livraison',
      DELIVERED: 'Livree',
      CANCELLED: 'Annulee',
    };
    return labels[status] || status;
  }
}
