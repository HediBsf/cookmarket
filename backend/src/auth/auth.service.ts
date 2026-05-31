import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  email?: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Cet email est deja utilise');
    }

    const role = data.role === 'SELLER' ? 'SELLER' : 'CLIENT';
    if (
      role === 'SELLER' &&
      (!data.sellerD17PhoneNumber || !data.sellerSubscriptionReference || !data.sellerSubscriptionProof)
    ) {
      throw new BadRequestException(
        'Le numero D17, la reference du transfert et la capture sont obligatoires pour un vendeur',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        city: data.city,
        address: data.address,
        role,
        sellerD17PhoneNumber: role === 'SELLER' ? data.sellerD17PhoneNumber : null,
        sellerSubscriptionStatus: role === 'SELLER' ? 'PENDING' : 'INACTIVE',
        sellerSubscriptionReference: role === 'SELLER' ? data.sellerSubscriptionReference : null,
        sellerSubscriptionProof: role === 'SELLER' ? data.sellerSubscriptionProof : null,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return {
      message: 'Compte cree. Vous pouvez vous connecter.',
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Lien de verification invalide ou expire');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { message: 'Email verifie avec succes' };
  }

  getGoogleAuthUrl() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
    if (!clientId || !callbackUrl) {
      throw new BadRequestException('Google OAuth nest pas configure');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async loginWithGoogle(code: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
    if (!clientId || !clientSecret || !callbackUrl) {
      throw new BadRequestException('Google OAuth nest pas configure');
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenBody = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenRes.ok || !tokenBody.access_token) {
      throw new UnauthorizedException(tokenBody.error_description || 'Connexion Google impossible');
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenBody.access_token}` },
    });
    const profile = (await profileRes.json()) as GoogleUserInfo;

    if (!profileRes.ok || !profile.email || profile.email_verified === false) {
      throw new UnauthorizedException('Compte Google non valide');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: profile.email } });
    const user =
      existing ??
      (await this.prisma.user.create({
        data: {
          firstName: profile.given_name || profile.name || 'Google',
          lastName: profile.family_name || 'User',
          email: profile.email,
          password: await bcrypt.hash(randomBytes(24).toString('hex'), 10),
          role: 'CLIENT',
          emailVerified: true,
        },
      }));

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
    };
  }

}
