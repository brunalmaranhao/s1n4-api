import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ResponsiblePartiesFactory } from 'test/factories/make-responsible-parties'
import { CustomerFactory } from 'test/factories/make-customer'
import { ProjectFactory } from 'test/factories/make-project'
import { ListProjectFactory } from 'test/factories/make-list-project-repository'

describe('Fetch List Project by Id  (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let projectFactory: ProjectFactory
  let customerFactory: CustomerFactory
  let listProjectFactory: ListProjectFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        ResponsiblePartiesFactory,
        CustomerFactory,
        ProjectFactory,
        ListProjectFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    projectFactory = moduleRef.get(ProjectFactory)
    listProjectFactory = moduleRef.get(ListProjectFactory)

    await app.init()
  })

  test('[GET] /list-project/customer/:customerId', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const listProject = await listProjectFactory.makePrismaListProject({
      customerId: customer.id,
    })

    await projectFactory.makePrismaProject({
      customerId: customer.id,
      listProjectsId: listProject.id,
      start: new Date('2025-03-02'),
      deadline: new Date('2025-03-03'),
    })
    await projectFactory.makePrismaProject({
      customerId: customer.id,
      listProjectsId: listProject.id,
      start: new Date('2025-11-11'),
      deadline: new Date('2025-12-12'),
    })
    // /list-project/customer/:customerId/startDate/:startDate/endDate/:endDate
    const response = await request(app.getHttpServer())
      .get(
        `/list-project/customer/${customer.id.toString()}/startDate/2025-02-02/endDate/2025-03-03`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.listProjects).toHaveLength(1)

    expect(response.body.listProjects[0].projects).toHaveLength(1)
  })
})
