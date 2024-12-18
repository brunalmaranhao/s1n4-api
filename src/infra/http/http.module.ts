import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateController } from './controllers/auth/authenticate-controller'
import { AuthenticateUserUseCase } from '@/domain/project/application/use-cases/authenticate-user'
import { CreateCustomerUseCase } from '@/domain/project/application/use-cases/create-customer'
import { FetchCostumersByStatusUseCase } from '@/domain/project/application/use-cases/fetch-costumers-by-status'
import { FetchCustomersController } from './controllers/customer/fetch-customers-by-status.controller'
import { UpdateCustomerController } from './controllers/customer/update-customer.controller'
import { UpdateCustomerUseCase } from '@/domain/project/application/use-cases/update-customer'
import { RemoveCustomerController } from './controllers/customer/remove-customer.controller'
import { RemoveCustomerUseCase } from '@/domain/project/application/use-cases/remove-customer'
import { FetchUsersController } from './controllers/user/fetch-users-by-status.controller'
import { FetchUsersByStatusUseCase } from '@/domain/project/application/use-cases/fetch-users-by-status'
import { CreateUserController } from './controllers/user/create-user-customer.controller'
import { CreateUserUseCase } from '@/domain/project/application/use-cases/create-user'
import { UpdateUserController } from './controllers/user/update-user.controller'
import { UpdateUserUseCase } from '@/domain/project/application/use-cases/update-user'
import { RemoveUserController } from './controllers/user/remove-user.controller'
import { RemoveUserUseCase } from '@/domain/project/application/use-cases/remove-user'
import { CreateResponsiblePartiesController } from './controllers/responsibleParties/create-responsible-parties.controller'
import { CreateResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/create-responsible-parties'
import { FetchResponsiblePartiesController } from './controllers/responsibleParties/fetch-responsible-parties-by-status.controller'
import { FetchResponsiblePartiesByStatusUseCase } from '@/domain/project/application/use-cases/fetch-responsible-parties-by-status'
import { UpdateResponsiblePartiesController } from './controllers/responsibleParties/update-responsible-parties.controller'
import { UpdateResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/update-responsible-parties'
import { RemoveResponsiblePartiesController } from './controllers/responsibleParties/remove-responsible-parties.controller'
import { RemoveResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/remove-responsible-parties'
import { CreateProjectController } from './controllers/project/create-project.controller'
import { CreateProjectUseCase } from '@/domain/project/application/use-cases/create-project'
import { UpdateProjectUseCase } from '@/domain/project/application/use-cases/update-project'
import { RemoveProjectController } from './controllers/project/remove-project.controller'
import { RemoveProjectUseCase } from '@/domain/project/application/use-cases/remove-project'
import { FetchRecentProjectsController } from './controllers/project/fetch-recent-projects.controller'
import { FetchRecentProjectsUseCase } from '@/domain/project/application/use-cases/fetch-recent-projects'
import { FetchProjectByStatusUseCase } from '@/domain/project/application/use-cases/fetch-project-by-status'
import { CreateInternalUserController } from './controllers/user/create-user-internal.controller'
import { FetchCustomerUsersController } from './controllers/customer/fetch-customer-users-controller'
import { FetchCustomerUsersUseCase } from '@/domain/project/application/use-cases/fetch-customer-users'
import { FetchCustomerResponsiblePartiesController } from './controllers/customer/fetch-customer-responsible-parties.controller'
import { FetchCustomerResponsiblePartiesUseCase } from '@/domain/project/application/use-cases/fetch-customer-responsible-parties'
import { FetchCustomerUseCase } from '@/domain/project/application/use-cases/fetch-customer-by-id'
import { FetchCustomerController } from './controllers/customer/fetch-customer-by-id.controller'
import { FetchCustomerProjectsController } from './controllers/customer/fetch-customer-projects.controller'
import { FetchCustomerProjectsUseCase } from '@/domain/project/application/use-cases/fetch-customer-projects'
import { FetchResponsiblePartiesByIdController } from './controllers/responsibleParties/fetch-responsible-parties-by-id.controller'
import { FetchResponsiblePartiesByIdUseCase } from '@/domain/project/application/use-cases/fetch-responsible-parties-by-id'
import { FetchProjectByIdController } from './controllers/project/fetch-project-by-id.controller'
import { FetchProjectByIdUseCase } from '@/domain/project/application/use-cases/fetch-project-by-id'
import { FetchUserByIdController } from './controllers/user/fetch-user-by-id.controller'
import { FetchUserByIdUseCase } from '@/domain/project/application/use-cases/fetch-user-by-id'
import { FetchResponsibleBirthdaysOfTheDayController } from './controllers/responsibleParties/fetch-responsible-birthdyas-of-the-day.controller'
import { FetchResponsibleBirthdaysOfTheDayUseCase } from '@/domain/project/application/use-cases/fetch-responsible-birthdays-of-the-day'
import { CreateProjectUpdateUseCase } from '@/domain/project/application/use-cases/create-project-updates'
import { CreateProjectUpdateController } from './controllers/project-updates/create-project-updates.controller'
import { RemoveProjectUpdateController } from './controllers/project-updates/remove-project-update'
import { RemoveProjectUpdatesUseCase } from '@/domain/project/application/use-cases/remove-project-updates'
import { UpdateProjectUpdatesController } from './controllers/project-updates/update-project-updates.controller'
import { UpdateProjectUpdateUseCase } from '@/domain/project/application/use-cases/update-project-update'
import { FetchActivesProjectUpdatesController } from './controllers/project-updates/fetch-actives-project-updates-by-customer-id.controller'
import { FetchProjectUpdateByStatusUseCase } from '@/domain/project/application/use-cases/fetch-project-updates-by-status'
import { FetchResponsibleBirthdaysOfTheMonthController } from './controllers/responsibleParties/fetch-responsible-birthdays-of-the-month.controller'
import { FetchResponsibleBirthdaysOfTheMonthUseCase } from '@/domain/project/application/use-cases/fetch-responsible-birthdays-of-the-month'
import { PbiModule } from '../pbi/pbi.module'
import { CreateReportController } from './controllers/report/create-report.controller'
import { CreateReportUseCase } from '@/domain/project/application/use-cases/create-report'
import { FetchReportUseCase } from '@/domain/project/application/use-cases/fetch-report'
import { FetchReportsUseCase } from '@/domain/project/application/use-cases/fetch-reports-customer'
import { FetchReportPbiController } from './controllers/report/fetch-report-pbi.controller'
import { FetchReportsController } from './controllers/report/fetch-reports.controller'
import { TaskScheduleModule } from '../schedule/schedule.module'
import { SuspendPbiCapacityController } from './controllers/report/suspend-pbi-capacity.controller'
import { FetchAllProjectUpdatesController } from './controllers/project-updates/fetch-all-project-updates.controller'
import { FetchAllProjectUpdatesUseCase } from '@/domain/project/application/use-cases/fetch-all-project-updates'
import { ValidateCustomerController } from './controllers/customer/validate-customer.controller'
import { ValidateCustomerUseCase } from '@/domain/project/application/use-cases/validate-customer'
import { FetchCustomersWithUsersController } from './controllers/customer/fetch-customer-with-users.controller'
import { FetchCustomersWithUsersUseCase } from '@/domain/project/application/use-cases/fetch-customers-with-users'
import { CreateCustomerAddressController } from './controllers/customer-address/create-customer-address.controller'
import { CreateCustomerAddressUseCase } from '@/domain/project/application/use-cases/create-customer-address'
import { CreateCustomerController } from './controllers/customer/create-customer.controller'
import { FetchCostumersByStatusWithoutPaginationUseCase } from '@/domain/project/application/use-cases/fetch-costumers-by-status-without-pagination'
import { FetchCustomersWithoutPaginationController } from './controllers/customer/fetch-customers-by-status-without-pagination.controller'
import { FetchNotificationsController } from './controllers/notifications/fetch-notifications.controller'
import { ReadNotificationController } from './controllers/notifications/read-notification.controller'
import { FetchNotificationsUseCase } from '@/domain/notification/application/use-cases/fetch-notification-by-recipient'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { FetchAllReportsPbiController } from './controllers/report/fetch-all-reports.controller'
import { FetchReportsByUserPbiController } from './controllers/report/fetch-reports-pbi-by-user.controller'
import { FetchReportsByCustomerPbiController } from './controllers/report/fetch-reports-pbi-by-customer.controller'
import { FetchAllReportsUseCase } from '@/domain/project/application/use-cases/fetch-all-reports'
import { FetchCustomerProjectsByUserController } from './controllers/project/fetch-customer-project-by-user.controller'
import { FetchCustomerProjectsByUserUseCase } from '@/domain/project/application/use-cases/fetch-customer-projects-by-user'
import { FetchReportsByCustomerController } from './controllers/report/fetch-reports-by-customer.controller'
import { FetchReportsByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-reports-by-customer'
import { JobsModule } from '../jobs/jobs.module'
import { CreateHistoryLogReportUseCase } from '@/domain/project/application/use-cases/create-history-log-report'
import { FetchLoggedUserController } from './controllers/user/fetch-logged-user.controller'
import { RemoveReportController } from './controllers/report/remove-report.controller'
import { RemoveReportUseCase } from '@/domain/project/application/use-cases/remove-report'
import { GenerateVerificationTokenUseCase } from '@/domain/project/application/use-cases/generate-verification-token'
import { ForgotPasswordController } from './controllers/user/forgot-password.controller'
import { UpdatePasswordPrivateController } from './controllers/user/update-password-private.controller'
import { UpdatePasswordController } from './controllers/user/update-password.controller'
import { VerifyAccountUseCase } from '@/domain/project/application/use-cases/verify-account'
import { UpdatePasswordUseCase } from '@/domain/project/application/use-cases/update-password'
import { CreateBudgetExpenseUseCase } from '@/domain/project/application/use-cases/create-budget-expense'
import { FetchBudgetsExpenseByProjectUseCase } from '@/domain/project/application/use-cases/fetch-budgets-by-project'
import { FetchBudgetsExpenseUseCase } from '@/domain/project/application/use-cases/fetch-budgets-expense'
import { CreateBudgetExpenseController } from './controllers/budget-expenses/create-budget-expenses.controller'
import { FetchBudgetExpenseByProjectController } from './controllers/budget-expenses/fetch-budget-expenses-by-project.controller'
import { FetchBudgetExpenseController } from './controllers/budget-expenses/fetch-budget-expenses.controller'
import { FetchBudgetExpenseByCustomerController } from './controllers/budget-expenses/fetch-budget-expenses-by-customer.controller'
import { FetchBudgetsExpenseByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-budgets-by-customer'
import { CreatePeriodicReportUseCase } from '@/domain/project/application/use-cases/create-periodic-report'
import { PeriodicReportController } from './controllers/periodic-reports/create-periodic-report.controller'
import { UploadFileUseCase } from '@/domain/project/application/use-cases/upload-file'
import { StorageModule } from '../storage/storage.module'
import { FetchPeriodicReportsByUserController } from './controllers/periodic-reports/fetch-periodics-reports.controller'
import { FetchPeriodicReportsByUserUseCase } from '@/domain/project/application/use-cases/fetch-period-report-by-user'
import { FetchPeriodicReportsByYearController } from './controllers/periodic-reports/fetch-periodic-reports-by-year.controller'
import { FetchPeriodicReportsByUserAndYearUseCase } from '@/domain/project/application/use-cases/fetch-period-report-by-user-and-year'
import { FetchBudgetExpenseBalanceByCustomerController } from './controllers/budget-expenses/fetch-budget-expense-balance-by-customer.controller'
import { FetchBudgetsExpenseBalanceUseCase } from '@/domain/project/application/use-cases/fetch-budget-expense-balance'
import { FetchBudgetExpenseBalanceByProjectController } from './controllers/budget-expenses/fetch-budget-expense-balance-by-project.controller'
import { FetchBudgetExpenseBalanceController } from './controllers/budget-expenses/fetch-budget-expense-balance.controller'
import { CreateListProjectController } from './controllers/list-project/create-list-project.controller'
import { CreateListProjectUseCase } from '@/domain/project/application/use-cases/create-list-project'
import { FetchListProjectsByCustomerUseCase } from '@/domain/project/application/use-cases/fetch-list-projects-by-customer'
import { FetchListProjectByCustomerController } from './controllers/list-project/fetch-list-project-by-customer.controller'
import { FetchListProjectByUserController } from './controllers/list-project/fetch-list-project-by-user.controller'
import { FetchListProjectsByUserUseCase } from '@/domain/project/application/use-cases/fetch-list-projects-by-user'
import { UpdateListProjectController } from './controllers/list-project/update-name-list-project.controller'
import { UpdateListProjectUseCase } from '@/domain/project/application/use-cases/update-list-project-name'
import { AddProjectToListProjectController } from './controllers/list-project/add-project-to-list-project.controller'
import { AddProjectListProjectUseCase } from '@/domain/project/application/use-cases/add-project-list-project'
import { RemoveListProjectController } from './controllers/list-project/remove-list-project.controller'
import { RemoveListProjectUseCase } from '@/domain/project/application/use-cases/remove-list-project'
import { UpdateOrderListProjectController } from './controllers/list-project/update-order-list-project.controller'
import { UpdateOrderListProjectUseCase } from '@/domain/project/application/use-cases/update-order-list-project'
import { UpdateProjectController } from './controllers/project/update-project.controller'
import { UpdateBudgetExpenseController } from './controllers/budget-expenses/update-budget-expense.controller'
import { UpdateBudgetExpenseUseCase } from '@/domain/project/application/use-cases/update-budget-expense'
import { RemoveBudgetExpenseController } from './controllers/budget-expenses/remove-budget-expense.controller'
import { RemoveBudgetExpenseUseCase } from '@/domain/project/application/use-cases/remove-budget-expense'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    PbiModule,
    TaskScheduleModule,
    JobsModule,
    StorageModule,
  ],
  controllers: [
    AuthenticateController,
    CreateCustomerController,
    FetchCustomerController,
    FetchCustomerProjectsController,
    FetchCustomerResponsiblePartiesController,
    FetchCustomersController,
    FetchCustomersWithUsersController,
    FetchCustomerUsersController,

    RemoveCustomerController,
    UpdateCustomerController,
    CreateInternalUserController,
    CreateUserController,
    FetchUserByIdController,
    FetchUsersController,
    RemoveUserController,
    UpdateUserController,
    CreateProjectController,
    FetchProjectByIdController,
    FetchRecentProjectsController,
    RemoveProjectController,
    CreateResponsiblePartiesController,
    FetchResponsibleBirthdaysOfTheDayController,
    FetchResponsibleBirthdaysOfTheMonthController,
    FetchResponsiblePartiesByIdController,
    FetchResponsiblePartiesController,
    RemoveResponsiblePartiesController,
    UpdateResponsiblePartiesController,
    CreateProjectUpdateController,
    RemoveProjectUpdateController,
    UpdateProjectUpdatesController,
    FetchAllProjectUpdatesController,
    FetchActivesProjectUpdatesController,
    CreateReportController,
    FetchReportPbiController,
    FetchReportsController,
    SuspendPbiCapacityController,
    ValidateCustomerController,
    CreateCustomerAddressController,
    FetchCustomersWithoutPaginationController,
    FetchNotificationsController,
    ReadNotificationController,
    FetchAllReportsPbiController,
    FetchReportsByUserPbiController,
    FetchReportsByCustomerPbiController,
    FetchCustomerProjectsByUserController,
    FetchReportsByCustomerController,
    FetchLoggedUserController,
    RemoveReportController,
    ForgotPasswordController,
    UpdatePasswordPrivateController,
    UpdatePasswordController,
    CreateBudgetExpenseController,
    FetchBudgetExpenseByProjectController,
    FetchBudgetExpenseController,
    FetchBudgetExpenseByCustomerController,
    UpdateBudgetExpenseController,
    RemoveBudgetExpenseController,
    PeriodicReportController,
    FetchPeriodicReportsByUserController,
    FetchPeriodicReportsByYearController,
    FetchBudgetExpenseBalanceByCustomerController,
    FetchBudgetExpenseBalanceByProjectController,
    FetchBudgetExpenseBalanceController,
    CreateListProjectController,
    FetchListProjectByCustomerController,
    FetchListProjectByUserController,
    UpdateListProjectController,
    AddProjectToListProjectController,
    RemoveListProjectController,
    UpdateOrderListProjectController,
    UpdateProjectController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateCustomerUseCase,
    FetchCostumersByStatusUseCase,
    UpdateCustomerUseCase,
    RemoveCustomerUseCase,
    UpdateCustomerUseCase,
    FetchUsersByStatusUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    RemoveUserUseCase,
    CreateResponsiblePartiesUseCase,
    FetchResponsiblePartiesByStatusUseCase,
    UpdateResponsiblePartiesUseCase,
    RemoveResponsiblePartiesUseCase,
    CreateProjectUseCase,
    UpdateProjectUseCase,
    RemoveProjectUseCase,
    FetchRecentProjectsUseCase,
    FetchProjectByStatusUseCase,
    FetchCustomerUsersUseCase,
    FetchCustomerResponsiblePartiesUseCase,
    FetchCustomerUseCase,
    FetchCustomerProjectsUseCase,
    FetchResponsiblePartiesByIdUseCase,
    FetchProjectByIdUseCase,
    FetchUserByIdUseCase,
    FetchResponsibleBirthdaysOfTheDayUseCase,
    FetchResponsibleBirthdaysOfTheMonthUseCase,
    CreateProjectUpdateUseCase,
    RemoveProjectUpdatesUseCase,
    UpdateProjectUpdateUseCase,
    FetchProjectUpdateByStatusUseCase,
    CreateReportUseCase,
    FetchReportUseCase,
    FetchReportsUseCase,
    FetchAllProjectUpdatesUseCase,
    ValidateCustomerUseCase,
    FetchCustomersWithUsersUseCase,
    CreateCustomerAddressUseCase,
    FetchCostumersByStatusWithoutPaginationUseCase,
    FetchNotificationsUseCase,
    ReadNotificationUseCase,
    FetchAllReportsUseCase,
    FetchCustomerProjectsByUserUseCase,
    FetchReportsByCustomerUseCase,
    CreateHistoryLogReportUseCase,
    RemoveReportUseCase,
    GenerateVerificationTokenUseCase,
    VerifyAccountUseCase,
    UpdatePasswordUseCase,
    CreateBudgetExpenseUseCase,
    FetchBudgetsExpenseByProjectUseCase,
    FetchBudgetsExpenseUseCase,
    FetchBudgetsExpenseByCustomerUseCase,
    CreatePeriodicReportUseCase,
    UploadFileUseCase,
    FetchPeriodicReportsByUserUseCase,
    FetchPeriodicReportsByUserAndYearUseCase,
    FetchBudgetsExpenseBalanceUseCase,
    CreateListProjectUseCase,
    FetchListProjectsByCustomerUseCase,
    FetchListProjectsByUserUseCase,
    UpdateListProjectUseCase,
    AddProjectListProjectUseCase,
    RemoveListProjectUseCase,
    UpdateOrderListProjectUseCase,
    UpdateBudgetExpenseUseCase,
    RemoveBudgetExpenseUseCase,
  ],
})
export class HttpModule {}
