import { CustomerFactory } from 'test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'
import { ListProjectFactory } from 'test/factories/make-list-project-repository'

describe('Create List Project (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let listProjectFactory: ListProjectFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, ListProjectFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    listProjectFactory = moduleRef.get(ListProjectFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /list-project', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const listProject = await listProjectFactory.makePrismaListProject({
      customerId: customer.id,
    })

    const response = await request(app.getHttpServer())
      .patch('/list-project')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Em andamento',
        id: listProject.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const projectOnDatabase = await prisma.listProjects.findFirst({
      where: {
        name: 'Em andamento',
        customerId: customer.id.toString(),
      },
    })

    expect(projectOnDatabase).toBeTruthy()
  })
})
