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

describe('Update Order List Project (E2E)', () => {
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

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /list-project/update-order', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    // Criação de múltiplos projetos para o cliente
    const listProject1 = await listProjectFactory.makePrismaListProject({
      customerId: customer.id,
      order: 1,
    })
    const listProject2 = await listProjectFactory.makePrismaListProject({
      customerId: customer.id,
      order: 2,
    })
    const listProject3 = await listProjectFactory.makePrismaListProject({
      customerId: customer.id,
      order: 3,
    })

    const response = await request(app.getHttpServer())
      .patch('/list-project/update-order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        order: [
          { id: listProject1.id.toString(), order: 3 },
          { id: listProject2.id.toString(), order: 1 },
          { id: listProject3.id.toString(), order: 2 },
        ],
      })

    expect(response.statusCode).toBe(201)

    const updatedProjects = await prisma.listProjects.findMany({
      where: { customerId: customer.id.toString() },
      orderBy: { order: 'asc' },
    })

    expect(updatedProjects).toHaveLength(3)
    expect(updatedProjects[0].id).toBe(listProject2.id.toString())
    expect(updatedProjects[1].id).toBe(listProject3.id.toString())
    expect(updatedProjects[2].id).toBe(listProject1.id.toString())
  })
})
