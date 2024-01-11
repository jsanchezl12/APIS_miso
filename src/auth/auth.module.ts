import { Module } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import constants from '../shared/security/constants';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserController } from '../user/controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
      // eslint-disable-next-line prettier/prettier
    })
  ],
  providers: [AuthService, UserService, JwtService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [UserController],
})
export class AuthModule {}
