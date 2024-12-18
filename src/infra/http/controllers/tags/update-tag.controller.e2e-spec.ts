import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { TagFactory } from 'test/factories/make-tag'
import { UserFactory } from 'test/factories/make-user'

describe('Update Tag (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let tagFactory: TagFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CustomerFactory, TagFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    tagFactory = moduleRef.get(TagFactory)

    await app.init()
  })

  test('[PUT] /tag/update/:id', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })
    const customer = await customerFactory.makePrismaCustomer()

    const tag = await tagFactory.makePrismaTag({
      customerId: customer.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/tag/update/${tag.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Tag Name',
      })

    expect(response.statusCode).toBe(201)

    const updatedTagOnDatabase = await prisma.tag.findFirst({
      where: {
        name: 'New Tag Name',
      },
    })

    expect(updatedTagOnDatabase).toBeTruthy()
  })
})
