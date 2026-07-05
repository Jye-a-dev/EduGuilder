import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurations } from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { OAuthAccountsModule } from './modules/oauth_accounts/oauth_accounts.module';
import { PasswordResetTokensModule } from './modules/password_reset_tokens/password_reset_tokens.module';
import { UserSessionsModule } from './modules/user_sessions/user_sessions.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { UniversityAdmissionsModule } from './modules/university_admissions/university_admissions.module';
import { StudentGradesModule } from './modules/student_grades/student_grades.module';
import { StudentVerificationsModule } from './modules/student_verifications/student_verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
    }),
    DatabaseModule,
    UsersModule,
    OAuthAccountsModule,
    PasswordResetTokensModule,
    UserSessionsModule,
    UniversitiesModule,
    UniversityAdmissionsModule,
    StudentGradesModule,
    StudentVerificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
