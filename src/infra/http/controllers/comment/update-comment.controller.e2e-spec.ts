import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { CommentFactory } from 'test/factories/make-comment'
import { CustomerFactory } from 'test/factories/make-customer'
import { ListProjectFactory } from 'test/factories/make-list-project-repository'
import { ProjectFactory } from 'test/factories/make-project'
import { ProjectUpdatesFactory } from 'test/factories/make-project-updates'
import { UserFactory } from 'test/factories/make-user'

describe('Update Comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let projectUpdateFactory: ProjectUpdatesFactory
  let projectFactory: ProjectFactory
  let customerFactory: CustomerFactory
  let listProjectFactory: ListProjectFactory
  let commentFactory: CommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        ProjectUpdatesFactory,
        ProjectFactory,
        CustomerFactory,
        ListProjectFactory,
        CommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    projectFactory = moduleRef.get(ProjectFactory)
    projectUpdateFactory = moduleRef.get(ProjectUpdatesFactory)
    customerFactory = moduleRef.get(CustomerFactory)
    listProjectFactory = moduleRef.get(ListProjectFactory)
    commentFactory = moduleRef.get(CommentFactory)

    await app.init()
  })

  test('[DELETE] /comment/:id', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const user = await userFactory.makePrismaUser()

    const user2 = await userFactory.makePrismaUser({
      role: 'CLIENT_OWNER',
      customerId: customer.id,
    })

    const accessToken = jwt.sign({
      sub: user2.id.toString(),
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

    const comment = await commentFactory.makePrismaComment({
      projectUpdateId: projectUpdate.id,
      authorId: user2.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/comment/update/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Comentário editado',
      })

    expect(response.statusCode).toBe(201)

    const updatedProjectOnDatabase = await prisma.comments.findFirst({
      where: {
        content: 'Comentário editado',
      },
    })

    expect(updatedProjectOnDatabase).toBeTruthy()
  })
})
