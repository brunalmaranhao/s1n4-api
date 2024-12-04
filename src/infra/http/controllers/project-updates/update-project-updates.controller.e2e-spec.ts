import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ProjectFactory } from 'test/factories/make-project'
import { ProjectUpdatesFactory } from 'test/factories/make-project-updates'
import { UserFactory } from 'test/factories/make-user'

describe('Update Project Updates(E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    projectUpdateFactory = moduleRef.get(ProjectUpdatesFactory)
    jwt = moduleRef.get(JwtService)
    projectFactory = moduleRef.get(ProjectFactory)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[PATCH] /project-updates', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const project = await projectFactory.makePrismaProject({
      customerId: customer.id,
    })

    const projectUpdate = await projectUpdateFactory.makePrismaProject({
      projectId: project.id,
      userId: user.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/project-updates/update/${projectUpdate.id.toString()} `)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'New description',
      })

    expect(response.statusCode).toBe(201)

    const projectUpdateOnDatabase = await prisma.projectUpdates.findFirst({
      where: {
        projectId: project.id.toString(),
        description: 'New description',
      },
    })

    expect(projectUpdateOnDatabase).toBeTruthy()
  })
})
