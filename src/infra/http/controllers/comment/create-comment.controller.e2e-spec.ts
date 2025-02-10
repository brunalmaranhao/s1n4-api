import { CustomerFactory } from 'test/factories/make-customer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'
import { ProjectUpdatesFactory } from 'test/factories/make-project-updates'
import { ProjectFactory } from 'test/factories/make-project'
import { ListProjectFactory } from 'test/factories/make-list-project-repository'

describe('Create Comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let projectUpdateFactory: ProjectUpdatesFactory
  let projectFactory: ProjectFactory
  let customerFactory: CustomerFactory
  let listProjectFactory: ListProjectFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        ProjectUpdatesFactory,
        ProjectFactory,
        CustomerFactory,
        ListProjectFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    projectFactory = moduleRef.get(ProjectFactory)
    projectUpdateFactory = moduleRef.get(ProjectUpdatesFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    listProjectFactory = moduleRef.get(ListProjectFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /comment', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const listProject = await listProjectFactory.makePrismaListProject({
      customerId: customer.id,
    })

    const project = await projectFactory.makePrismaProject({
      customerId: customer.id,
      listProjectsId: listProject.id,
    })

    const projectUpdate = await projectUpdateFactory.makePrismaProject({
      projectId: project.id,
      userId: user.id,
    })

    const response = await request(app.getHttpServer())
      .post('/comment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Comentário teste',
        projectUpdateId: projectUpdate.id.toString(),
      })
    console.log(response)

    expect(response.statusCode).toBe(201)

    const commentOnDatabase = await prisma.comments.findFirst({
      where: {
        content: 'Comentário teste',
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
