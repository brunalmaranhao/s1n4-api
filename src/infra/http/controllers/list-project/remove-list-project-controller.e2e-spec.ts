import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ListProjectFactory } from 'test/factories/make-list-project-repository'
import { ProjectFactory } from 'test/factories/make-project'
import { UserFactory } from 'test/factories/make-user'

describe('Remove List Project (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let projectFactory: ProjectFactory
  let listProjectFactory: ListProjectFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        CustomerFactory,
        ProjectFactory,
        ListProjectFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    listProjectFactory = moduleRef.get(ListProjectFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    projectFactory = moduleRef.get(ProjectFactory)

    await app.init()
  })

  test('[DELETE] /list-project/:id', async () => {
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

    const response = await request(app.getHttpServer())
      .delete(`/list-project/${listProject.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const canceledProjectOnDatabase = await prisma.listProjects.findFirst({
      where: {
        status: 'INACTIVE',
      },
    })

    expect(canceledProjectOnDatabase).toBeTruthy()
    expect(canceledProjectOnDatabase?.status).toBe('INACTIVE')
  })
})
