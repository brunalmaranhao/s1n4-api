import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Create Customer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /customer', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const response = await request(app.getHttpServer())
      .post('/customer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Empresa teste LTDA',
        corporateName: 'Empresa teste',
        cnpj: '33.813.838/0001-53',
      })

    expect(response.statusCode).toBe(201)

    const customerOnDatabase = await prisma.customer.findFirst({
      where: {
        name: 'Empresa teste LTDA',
      },
    })

    expect(customerOnDatabase).toBeTruthy()
  })
})
