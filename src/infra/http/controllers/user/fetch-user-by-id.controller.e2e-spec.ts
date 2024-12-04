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

describe('Fetch Project by Id  (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let projectFactory: ProjectFactory
  let customerFactory: CustomerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        ResponsiblePartiesFactory,
        CustomerFactory,
        ProjectFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    projectFactory = moduleRef.get(ProjectFactory)

    await app.init()
  })

  test('[GET] /user/id/:id', async () => {
    const userManager = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: userManager.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const prismaUser = await userFactory.makePrismaUser()

    const response = await request(app.getHttpServer())
      .get(`/user/id/${prismaUser.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.user.id.toString()).toEqual(prismaUser.id.toString())
  })
})
