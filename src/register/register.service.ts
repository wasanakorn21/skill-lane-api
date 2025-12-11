import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (user) {
      throw new Error('Username already exists');
    }

    return await this.prisma.user.create({
      data: {
        username: registerDto.username,
        password: registerDto.password,
      },
    });
  }
}
