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
import { ProjectFactory } from 'test/factories/make-project'
import { TagFactory } from 'test/factories/make-tag'

describe('Add Tag to Project (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let listProjectFactory: ListProjectFactory
  let projectFactory: ProjectFactory
  let tagFactory: TagFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CustomerFactory,
        ListProjectFactory,
        ProjectFactory,
        TagFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    listProjectFactory = moduleRef.get(ListProjectFactory)
    projectFactory = moduleRef.get(ProjectFactory)
    tagFactory = moduleRef.get(TagFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /project/tag/:tagId/add', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const listProject = await listProjectFactory.makePrismaListProject({
      customerId: customer.id,
    })
    const project = await projectFactory.makePrismaProject({
      customerId: customer.id,
      listProjectsId: listProject.id,
    })

    const tag = await tagFactory.makePrismaTag({
      customerId: customer.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/project/tag/${tag.id.toString()}/add`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        tagId: tag.id.toString(),
        projectId: project.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const projectOnDatabase = await prisma.project.findFirst({
      where: {
        customerId: customer.id.toString(),
      },
      include: {
        tags: true,
      },
    })

    console.log(projectOnDatabase)

    expect(projectOnDatabase).toMatchObject({
      tags: expect.arrayContaining([
        expect.objectContaining({
          customerId: customer.id.toString(),
          name: tag.name,
        }),
      ]),
    })

    expect(projectOnDatabase).toBeTruthy()
  })
})
