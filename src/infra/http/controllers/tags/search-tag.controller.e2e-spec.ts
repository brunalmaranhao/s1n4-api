import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { ResponsiblePartiesFactory } from 'test/factories/make-responsible-parties'
import { CustomerFactory } from 'test/factories/make-customer'
import { TagFactory } from 'test/factories/make-tag'

describe('Search Tag by Name and Customer (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let tagFactory: TagFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        ResponsiblePartiesFactory,
        CustomerFactory,
        TagFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    tagFactory = moduleRef.get(TagFactory)

    await app.init()
  })

  test('[GET] /tags/search/customer/:customerId/name/:name', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const tagCreated = await tagFactory.makePrismaTag({
      customerId: customer.id,
      name: 'Test Tag',
    })

    const response = await request(app.getHttpServer())
      .get(`/tags/search/customer/${customer.id.toString()}/name/Test`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      tags: expect.arrayContaining([
        expect.objectContaining({
          customerId: customer.id.toString(),
          name: tagCreated.name,
        }),
      ]),
    })
  })
})
