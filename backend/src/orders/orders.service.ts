import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  findAll() {
    return this.prisma.order.findMany({
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } },
        items: {
          include: {
            dish: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
            formation: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } },
        items: {
          include: {
            dish: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
            formation: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
          },
        },
      },
    });
  }

  findByClient(clientId: number) {
    return this.prisma.order.findMany({
      where: { clientId },
      include: {
        items: {
          include: {
            dish: { include: { seller: { select: { id: true, firstName: true, lastName: true, city: true } } } },
            formation: { include: { seller: { select: { id: true, firstName: true, lastName: true, city: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySeller(sellerId: number) {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            OR: [{ dish: { sellerId } }, { formation: { sellerId } }],
          },
        },
      },
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } },
        items: {
          where: {
            OR: [{ dish: { sellerId } }, { formation: { sellerId } }],
          },
          include: {
            dish: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
            formation: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      ...order,
      sellerSubtotal: order.items.reduce((sum, item) => sum + item.subtotal, 0),
    }));
  }

  async create(data: any, clientId: number) {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException('Le panier est vide');
    }
    const requiredFields = [
      'customerFirstName',
      'customerLastName',
      'customerEmail',
      'customerPhone',
    ];
    const missingField = requiredFields.find((field) => !data[field]);
    if (missingField) {
      throw new BadRequestException('Informations client incompletes');
    }

    const items = await Promise.all(
      data.items.map(async (item: any) => {
        const quantity = Math.max(1, Number(item.quantity || 1));
        if (item.itemType === 'FORMATION') {
        const formation = await this.prisma.formation.findUnique({
            where: { id: Number(item.id) },
            include: {
              seller: {
                select: {
                  id: true,
                  sellerD17PhoneNumber: true,
                },
              },
            },
          });
          if (!formation) throw new NotFoundException('Formation introuvable');
          return {
            formationId: formation.id,
            sellerId: formation.sellerId,
            sellerD17PhoneNumber: formation.seller.sellerD17PhoneNumber,
            quantity,
            unitPrice: formation.price,
            subtotal: formation.price * quantity,
          };
        }

        const dish = await this.prisma.dish.findUnique({
          where: { id: Number(item.id) },
        });
        if (!dish) throw new NotFoundException('Plat introuvable');
        return {
          dishId: dish.id,
          sellerId: dish.sellerId,
          quantity,
          unitPrice: dish.price,
          subtotal: dish.price * quantity,
        };
      }),
    );

    const hasFormation = items.some((item) => item.formationId);
    const hasDish = items.some((item) => item.dishId);
    if (hasFormation && hasDish) {
      throw new BadRequestException('Veuillez commander les plats et les formations separement');
    }
    if (hasDish && (!data.deliveryAddress || !data.deliveryCity)) {
      throw new BadRequestException('Informations de livraison obligatoires pour les plats');
    }
    if (hasFormation && (!data.d17TransferReference || !data.d17TransferProof)) {
      throw new BadRequestException('Preuve de paiement D17 obligatoire pour les formations');
    }
    const sellerIds = Array.from(new Set(items.map((item) => item.sellerId)));
    if (sellerIds.length > 1) {
      throw new BadRequestException('Veuillez commander les articles de vendeurs differents separement');
    }
    const sellerD17PhoneNumber = hasFormation
      ? items.find((item) => item.formationId)?.sellerD17PhoneNumber
      : null;
    if (hasFormation && !sellerD17PhoneNumber) {
      throw new BadRequestException('Numero D17 du vendeur indisponible');
    }

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryFee = hasDish ? Number(data.deliveryFee ?? 7) : 0;
    const totalPrice = subtotal + deliveryFee;

    const order = await this.prisma.order.create({
      data: {
        clientId,
        customerFirstName: data.customerFirstName,
        customerLastName: data.customerLastName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryAddress: hasDish ? data.deliveryAddress : 'Formation en ligne',
        deliveryCity: hasDish ? data.deliveryCity : '',
        deliveryFee,
        totalPrice,
        paymentMethod: hasFormation ? 'D17_TRANSFER' : 'CASH_ON_DELIVERY',
        paymentStatus: hasFormation ? 'WAITING_SELLER_CONFIRMATION' : 'PENDING',
        d17PhoneNumber: hasFormation ? sellerD17PhoneNumber : null,
        d17TransferReference: hasFormation ? data.d17TransferReference : null,
        d17TransferProof: hasFormation ? data.d17TransferProof : null,
        items: {
          create: items.map(({ sellerId, sellerD17PhoneNumber, ...item }) => item),
        },
      },
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } },
        items: {
          include: {
            dish: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
            formation: { include: { seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, city: true, address: true } } } },
          },
        },
      },
    });

    await this.notifications.notifyNewOrder({
      sellerId: Number(sellerIds[0]),
      orderId: order.id,
      customerName: `${data.customerFirstName} ${data.customerLastName}`,
      total: totalPrice,
      paymentMethod: hasFormation ? 'D17' : 'livraison',
    });

    return order;
  }

  async updateStatus(id: number, status: OrderStatus, sellerId: number) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException('Statut invalide');
    }
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        items: {
          some: {
            OR: [{ dish: { sellerId } }, { formation: { sellerId } }],
          },
        },
      },
    });
    if (!order) {
      throw new ForbiddenException('Commande introuvable pour ce vendeur');
    }
    const updated = await this.prisma.order.update({ where: { id }, data: { status } });
    await this.notifications.notifyCustomerOrderStatus({
      orderId: updated.id,
      clientId: updated.clientId,
      status: updated.status,
    });
    return updated;
  }

  async markSellerPaid(id: number, sellerId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        items: {
          some: {
            OR: [{ dish: { sellerId } }, { formation: { sellerId } }],
          },
        },
      },
    });
    if (!order) {
      throw new ForbiddenException('Commande introuvable pour ce vendeur');
    }
    if (order.paymentMethod === 'D17_TRANSFER' && order.paymentStatus !== 'SELLER_CONFIRMED') {
      throw new BadRequestException('Confirmez d abord le paiement D17');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Impossible de payer une commande annulee');
    }
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('La commande doit etre livree avant de payer le vendeur');
    }
    return this.prisma.order.update({
      where: { id },
      data: {
        sellerPaid: true,
        paymentStatus: 'SELLER_PAID',
      },
    });
  }

  async confirmD17Payment(id: number, sellerId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        paymentMethod: 'D17_TRANSFER',
        items: {
          some: {
            formation: { sellerId },
          },
        },
      },
    });
    if (!order) {
      throw new ForbiddenException('Commande D17 introuvable pour ce vendeur');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        paymentStatus: 'SELLER_CONFIRMED',
        status: OrderStatus.ACCEPTED,
      },
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}
