import { CustomerFactory } from '../../../../../test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ProjectFactory } from 'test/factories/make-project'

describe('Fetch Customer Projects (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let projectFactory: ProjectFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, ProjectFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    customerFactory = moduleRef.get(CustomerFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    projectFactory = moduleRef.get(ProjectFactory)

    await app.init()
  })

  test('[GET] /projects/customer', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const user = await userFactory.makePrismaUserManagement({
      customerId: customer.id,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'CLIENT_USER',
    })

    await Promise.all([
      projectFactory.makePrismaProject({
        customerId: customer.id,
      }),
      projectFactory.makePrismaProject({
        customerId: customer.id,
      }),
      projectFactory.makePrismaProject({
        customerId: customer.id,
      }),
      projectFactory.makePrismaProject({
        customerId: customer.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/projects/customer`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.projects).toHaveLength(4)
    expect(response.body).toEqual({
      projects: expect.arrayContaining([
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
        expect.objectContaining({
          customerId: customer.id.toString(),
        }),
      ]),
    })
  })
})
