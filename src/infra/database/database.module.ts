import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CustomerRepository } from '@/domain/project/application/repositories/customer-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customer-repository'
import { HistoryLogRepository } from '@/domain/project/application/repositories/history-repository'
import { PrismaHistoryLogsRepository } from './prisma/repositories/prisma-history-repository'
import { ProjectRepository } from '@/domain/project/application/repositories/project-repository'
import { PrismaProjectRepository } from './prisma/repositories/prisma-project-repository'
import { ReportRepository } from '@/domain/project/application/repositories/report-repository'
import { PrismaReportsRepository } from './prisma/repositories/prisma-report-repository'
import { ResponsiblePartiesRepository } from '@/domain/project/application/repositories/responsible-parties'
import { PrismaResponsibleRepository } from './prisma/repositories/prisma-responsible-repository'
import { UserRepository } from '@/domain/project/application/repositories/user-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { ProjectUpdateRepository } from '@/domain/project/application/repositories/project-update-repository'
import { PrismaProjectUpdateRepository } from './prisma/repositories/prisma-project-updates-repository'
import { CustomerAddressRepository } from '@/domain/project/application/repositories/customer-address-repository'
import { PrismaCustomerAddressRepository } from './prisma/repositories/prisma-customer-address-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { VerificationTokenRepository } from '@/domain/project/application/repositories/verification-token-repository'
import { PrismaVerificationTokenRepository } from './prisma/repositories/prisma-verification-token-reposiotry'
import { BudgetExpenseRepository } from '@/domain/project/application/repositories/budget-expense'
import { PrismaBudgetExpenseRepository } from './prisma/repositories/prisma-budget-expense-repository'
import { PeriodicReportRepository } from '@/domain/project/application/repositories/periodic-reports-repository'
import { PrismaPeriodicReportsRepository } from './prisma/repositories/prisma-periodic-report-repository'
import { ListProjectRepository } from '@/domain/project/application/repositories/list-projects-repository'
import { PrismaListProjectRepository } from './prisma/repositories/prisma-list-projects-repository'
import { TagRepository } from '@/domain/project/application/repositories/tag-repository'
import { PrismaTagRepository } from './prisma/repositories/prisma-tag-repository'
import { CommentRepository } from '@/domain/project/application/repositories/comment-repository'
import { PrismaCommentRepository } from './prisma/repositories/prisma-comment-repository'
import { ReactionRepository } from '@/domain/project/application/repositories/reaction-repository'
import { PrismaReactionRepository } from './prisma/repositories/prisma-reaction-repository'
import { EmojiRepository } from '@/domain/project/application/repositories/emoji-repository'
import { PrismaEmojiRepository } from './prisma/repositories/prisma-emoji-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CustomerRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: HistoryLogRepository,
      useClass: PrismaHistoryLogsRepository,
    },
    {
      provide: ProjectRepository,
      useClass: PrismaProjectRepository,
    },
    {
      provide: ReportRepository,
      useClass: PrismaReportsRepository,
    },
    {
      provide: ResponsiblePartiesRepository,
      useClass: PrismaResponsibleRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUsersRepository,
    },

    {
      provide: ProjectUpdateRepository,
      useClass: PrismaProjectUpdateRepository,
    },

    {
      provide: CustomerAddressRepository,
      useClass: PrismaCustomerAddressRepository,
    },
    {
      provide: CustomerAddressRepository,
      useClass: PrismaCustomerAddressRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: VerificationTokenRepository,
      useClass: PrismaVerificationTokenRepository,
    },
    {
      provide: BudgetExpenseRepository,
      useClass: PrismaBudgetExpenseRepository,
    },
    {
      provide: PeriodicReportRepository,
      useClass: PrismaPeriodicReportsRepository,
    },
    {
      provide: ListProjectRepository,
      useClass: PrismaListProjectRepository,
    },
    {
      provide: TagRepository,
      useClass: PrismaTagRepository,
    },
    {
      provide: CommentRepository,
      useClass: PrismaCommentRepository,
    },
    {
      provide: ReactionRepository,
      useClass: PrismaReactionRepository,
    },
    {
      provide: EmojiRepository,
      useClass: PrismaEmojiRepository,
    },
  ],
  exports: [
    PrismaService,
    CustomerRepository,
    HistoryLogRepository,
    ProjectRepository,
    ReportRepository,
    ResponsiblePartiesRepository,
    UserRepository,
    ProjectUpdateRepository,
    CustomerAddressRepository,
    NotificationsRepository,
    VerificationTokenRepository,
    BudgetExpenseRepository,
    PeriodicReportRepository,
    ListProjectRepository,
    TagRepository,
    CommentRepository,
    EmojiRepository,
    ReactionRepository,
  ],
})
export class DatabaseModule {}
