import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        difficulty: true,
        preparationTime: true,
        cookingTime: true,
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        category: true,
        comments: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  addComment(recipeId: number, userId: number, content: string) {
    return this.prisma.comment.create({
      data: {
        recipeId,
        userId,
        content,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  create(data: any) {
    return this.prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        ingredients: data.ingredients,
        steps: data.steps,
        preparationTime: Number(data.preparationTime),
        cookingTime: data.cookingTime ? Number(data.cookingTime) : null,
        difficulty: data.difficulty,
        servings: data.servings ? Number(data.servings) : null,
        userId: Number(data.userId),
        categoryId: data.categoryId ? Number(data.categoryId) : null,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.recipe.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
