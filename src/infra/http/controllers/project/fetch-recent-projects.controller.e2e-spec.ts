import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ProjectFactory } from 'test/factories/make-project'

describe('Fetch Recent Projects  (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let jwt: JwtService
  let projectFactory: ProjectFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, ProjectFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    projectFactory = moduleRef.get(ProjectFactory)

    await app.init()
  })

  test('[GET] /project', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    await Promise.all([
      projectFactory.makePrismaProject({
        name: 'Projeto 1',
        customerId: customer.id,
        statusProject: 'APPROVED',
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 2',
        customerId: customer.id,
        statusProject: 'APPROVED',
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 3',
        customerId: customer.id,
        statusProject: 'WAITING',
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 4',
        customerId: customer.id,
        statusProject: 'DISAPPROVED',
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 5',
        customerId: customer.id,
        statusProject: 'DONE',
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 6',
        customerId: customer.id,
        statusProject: 'DONE',
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 7',
        customerId: customer.id,
        statusProject: 'WAITING',
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 8',
        customerId: customer.id,
        statusProject: 'CANCELED',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/project`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    // console.log(response.body.projects)

    expect(response.statusCode).toBe(200)
    expect(response.body.projects).toHaveLength(8)
  })
})
