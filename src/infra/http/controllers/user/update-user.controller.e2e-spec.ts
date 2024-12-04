import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Update User (E2E)', () => {
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

  test('[PUT] /user/update/id', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const userCustomerUpdate = await userFactory.makePrismaUser({
      role: 'CLIENT_OWNER',
    })

    const response = await request(app.getHttpServer())
      .put(`/user/update/${userCustomerUpdate.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        role: 'CLIENT_USER',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findFirst({
      where: {
        role: 'CLIENT_USER',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
