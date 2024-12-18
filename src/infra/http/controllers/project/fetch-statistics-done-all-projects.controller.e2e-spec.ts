import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/make-user'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'
import { ProjectFactory } from 'test/factories/make-project'
import { ListProjectFactory } from 'test/factories/make-list-project-repository'

describe('Fetch Statistics Done Projects  (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let customerFactory: CustomerFactory
  let jwt: JwtService
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
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    projectFactory = moduleRef.get(ProjectFactory)
    listProjectFactory = moduleRef.get(ListProjectFactory)
    await app.init()
  })

  test('[GET] /projects/statistics-done', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      role: 'INTERNAL_MANAGEMENT',
    })

    const customer = await customerFactory.makePrismaCustomer()

    const listProjects = await listProjectFactory.makePrismaListProject({
      isDone: false,
      customerId: customer.id,
    })
    const listProjectsDone = await listProjectFactory.makePrismaListProject({
      isDone: true,
      customerId: customer.id,
    })

    await Promise.all([
      projectFactory.makePrismaProject({
        name: 'Projeto 1',
        customerId: customer.id,
        status: 'ACTIVE',
        listProjectsId: listProjects.id,
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 2',
        customerId: customer.id,
        status: 'ACTIVE',
        listProjectsId: listProjects.id,
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 3',
        customerId: customer.id,
        status: 'ACTIVE',
        listProjectsId: listProjects.id,
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 4',
        customerId: customer.id,
        status: 'ACTIVE',
        listProjectsId: listProjects.id,
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 5',
        customerId: customer.id,
        status: 'ACTIVE',
        listProjectsId: listProjects.id,
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 6',
        customerId: customer.id,
        status: 'ACTIVE',
        listProjectsId: listProjects.id,
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 7',
        customerId: customer.id,
        status: 'DONE',
        listProjectsId: listProjectsDone.id,
      }),
      projectFactory.makePrismaProject({
        name: 'Projeto 8',
        customerId: customer.id,
        status: 'DONE',
        listProjectsId: listProjectsDone.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/projects/statistics-done`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    // console.log(response.body.projects)

    expect(response.statusCode).toBe(200)
    expect(response.body.projects).toHaveLength(2)
    expect(response.body.total).toEqual(8)
  })
})
