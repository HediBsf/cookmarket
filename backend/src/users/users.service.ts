import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, role: true, city: true, createdAt: true },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, phone: true, city: true, address: true, profileImageUrl: true },
    });
  }

  me(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        role: true,
        profileImageUrl: true,
        createdAt: true,
      },
    });
  }

  create(data: any) {
    return this.prisma.user.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  updateMe(id: number, data: any) {
    const allowed = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      city: data.city,
      address: data.address,
      profileImageUrl: data.profileImageUrl,
    };

    return this.prisma.user.update({
      where: { id },
      data: allowed,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        role: true,
        profileImageUrl: true,
        createdAt: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  sellerSubscription(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        sellerSubscriptionStatus: true,
        sellerSubscriptionExpiresAt: true,
        sellerSubscriptionReference: true,
        sellerSubscriptionProof: true,
        sellerD17PhoneNumber: true,
      },
    }).then((user) => ({
      ...user,
      amount: Number(process.env.SELLER_SUBSCRIPTION_PRICE || 20),
      d17PhoneNumber: process.env.D17_PHONE_NUMBER || '+21600000000',
    }));
  }

  async submitSellerSubscriptionPayment(userId: number, data: any) {
    const sellerD17PhoneNumber = String(data.sellerD17PhoneNumber || '').trim();
    const reference = String(data.reference || '').trim();
    const proof = String(data.proof || '').trim();

    if (!sellerD17PhoneNumber || !reference || !proof) {
      throw new BadRequestException('Numero D17 vendeur, reference et capture obligatoires');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        sellerD17PhoneNumber,
        sellerSubscriptionStatus: 'PENDING',
        sellerSubscriptionReference: reference,
        sellerSubscriptionProof: proof,
      },
      select: {
        id: true,
        sellerD17PhoneNumber: true,
        sellerSubscriptionStatus: true,
        sellerSubscriptionReference: true,
      },
    });

    await this.notifyAdminsAboutSellerRequest(user, sellerD17PhoneNumber, reference);

    return updated;
  }

  async contactSupport(userId: number, data: any) {
    const subject = String(data.subject || '').trim();
    const message = String(data.message || '').trim();

    if (!subject || !message) {
      throw new BadRequestException('Sujet et message obligatoires');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const ticket = await this.prisma.supportTicket.create({
      data: {
        userId,
        subject,
        message,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
      },
    });

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });
    if (admins.length > 0) {
      await this.prisma.notification.createMany({
        data: admins.map((admin) => ({
          sellerId: admin.id,
          title: "Nouvelle demande d'aide",
          message: `#${ticket.id} - ${user.firstName} ${user.lastName}: ${subject}`,
        })),
      });
    }

    await this.sendSupportTicketEmailToAdmin({
      ticketId: ticket.id,
      subject,
      message,
      requester: user,
    });

    return { message: "Votre demande a ete envoyee a l'admin.", ticket };
  }

  mySupportTickets(userId: number) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: {
        repliedBy: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async notifyAdminsAboutSellerRequest(
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      city?: string | null;
    },
    sellerD17PhoneNumber: string,
    reference: string,
  ) {
    const notificationTitle = 'Nouvelle demande vendeur';
    const notificationMessage = `${user.firstName} ${user.lastName} a envoye une demande vendeur. D17: ${sellerD17PhoneNumber}. Ref: ${reference}.`;

    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true },
    });

    if (admins.length > 0) {
      await this.prisma.notification.createMany({
        data: admins.map((admin) => ({
          sellerId: admin.id,
          title: notificationTitle,
          message: notificationMessage,
        })),
      });
    }
  }

  private async sendSupportTicketEmailToAdmin(data: {
    ticketId: number;
    subject: string;
    message: string;
    requester: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      city?: string | null;
      role: Role;
    };
  }) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (!adminEmail || !smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      console.warn('Email admin non envoye: configuration SMTP incomplete');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    try {
      await transporter.sendMail({
        from: smtpFrom,
        to: adminEmail,
        subject: `Nouveau ticket support #${data.ticketId} - ${data.subject}`,
        text: [
          `Un nouveau ticket support a ete envoye.`,
          ``,
          `Ticket: #${data.ticketId}`,
          `Sujet: ${data.subject}`,
          `Message: ${data.message}`,
          ``,
          `Utilisateur: ${data.requester.firstName} ${data.requester.lastName}`,
          `Email: ${data.requester.email}`,
          `Telephone: ${data.requester.phone || 'Non renseigne'}`,
          `Ville: ${data.requester.city || 'Non renseignee'}`,
          `Role: ${data.requester.role}`,
        ].join('\n'),
      });
    } catch (error) {
      console.error('Erreur envoi email ticket support admin', error);
    }
  }
}
