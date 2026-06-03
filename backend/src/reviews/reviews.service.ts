import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.review.findMany({ include: { user: true, dish: true }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.review.findUnique({ where: { id }, include: { user: true, dish: true } });
  }

  create(data: any, userId: number) {
    return this.prisma.review.create({
      data: {
        userId,
        dishId: Number(data.dishId),
        rating: Number(data.rating),
        comment: data.comment,
      },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  update(id: number, data: any) {
    return this.prisma.review.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.review.delete({ where: { id } });
  }
}
