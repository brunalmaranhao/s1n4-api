import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ProjectFactory } from 'test/factories/make-project'
import { ProjectUpdatesFactory } from 'test/factories/make-project-updates'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch all Active Project Updates (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let userFactory: UserFactory
  let projectUpdateFactory: ProjectUpdatesFactory
  let customerFactory: CustomerFactory
  let projectFactory: ProjectFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        ProjectUpdatesFactory,
        CustomerFactory,
        ProjectFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    projectUpdateFactory = moduleRef.get(ProjectUpdatesFactory)
    jwt = moduleRef.get(JwtService)
    projectFactory = moduleRef.get(ProjectFactory)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[GET] /project-updates', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const project = await projectFactory.makePrismaProject({
      customerId: customer.id,
    })

    await projectUpdateFactory.makePrismaProject({
      projectId: project.id,
      userId: user.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/project-updates`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body.updates).toHaveLength(1)
  })
})
