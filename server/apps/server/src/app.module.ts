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
import { AuthModule } from './modules/auth/auth.module';
import { NotesModule } from './modules/notes/notes.module';
import { FileNodesModule } from './modules/file_nodes/file_nodes.module';
import { DocumentExportsModule } from './modules/document_exports/document_exports.module';
import { UniversityReviewsModule } from './modules/university_reviews/university_reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AuditLogsModule } from './modules/audit_logs/audit_logs.module';

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
    AuthModule,
    NotesModule,
    FileNodesModule,
    DocumentExportsModule,
    UniversityReviewsModule,
    NotificationsModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
