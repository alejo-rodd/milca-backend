import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { Twilio } from 'twilio';
import { generateOtp, validateOtp } from './utils/otp-generator';

@Injectable()
export class AuthService {
  private client: Twilio;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ) {
    this.client = new Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );

  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      //   delete user.password;

      return {
        user: userData,
        token: this.getJwtToken({ id: user.id }),
      };
      // TODO: Retornar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        name: true,
        roles: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    const { password: _, ...userData } = user;
    // delete user.password;

    return {
      user: userData,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      user: user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }

  async sendResetCode(phone: number): Promise<{ expiresIn: number }> {
    const code = generateOtp(phone);

    await this.client.messages.create({
      body: `Tu código de recuperación es: ${code}`,
      from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
      to: 'whatsapp:+57' + phone,
    });

    const currentMinutes = new Date().getMinutes();
    const remaining = 15 - (currentMinutes % 15);

    return { expiresIn: remaining };
  }

  async verifyCode(phone: number, code: string): Promise<{ success: boolean; message: string }> {
    const result = validateOtp(phone, code);

    switch (result) {
      case 'valid':
        return { success: true, message: 'Código válido. Puede cambiar la contraseña.' };
      case 'expired':
        return { success: false, message: 'El código ha expirado. Intenta nuevamente.' };
      default:
        return { success: false, message: 'Código incorrecto.' };
    }
  }

  async resetPassword(phone: number, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // Verifica el código OTP
    const result = validateOtp(phone, code);

    if (result !== 'valid') {
      return {
        success: false,
        message:
          result === 'expired'
            ? 'El código ha expirado. Intenta nuevamente.'
            : 'Código incorrecto.',
      };
    }

    // Busca el usuario por número de teléfono
    const user = await this.userRepository.findOne({
      where: { phoneNumber: phone },
    });

    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado.',
      };
    }

    // Actualiza la contraseña
    user.password = bcrypt.hashSync(newPassword, 10);
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Contraseña restablecida correctamente.',
    };
  }

  async isNumberRegistered(phone: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { phoneNumber: phone },
    });

    return !!user;
  }


  async updateProfile(
    userId: string,
    updates: { name?: string; email?: string; phoneNumber?: number }
  ): Promise<{ success: boolean; message: string, user: User | null }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado.',
        user: null
      };
    }

    if (updates.name !== undefined) user.name = updates.name;
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.phoneNumber !== undefined) user.phoneNumber = updates.phoneNumber;

    try {
      const userUploaded = await this.userRepository.save(user);
      return {
        success: true,
        message: 'Perfil actualizado correctamente.',
        user: userUploaded
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

}
