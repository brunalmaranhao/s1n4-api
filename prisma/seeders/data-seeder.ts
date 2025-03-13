import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { faker } from '@faker-js/faker'

export async function CreateInitialDataSeeder(prisma: PrismaClient) {
  async function createDepartments() {
    const names = [
      'Projetos',
      'Redes',
      'Marketing',
      'Produção',
      'Compras',
      'Contratos',
      'Jurídico',
      'Financeiro',
      'Estoque',
      'Promo',
    ]

    for (const name of names) {
      await prisma.department.create({
        data: {
          name,
          permissions: [
            'CREATE_COMMENT',
            'CREATE_REACTION',
            'VIEW_FINANCIAL',
            'VIEW_PROJECT',
            'VIEW_REPORT',
          ],
          status: 'ACTIVE',
        },
      })
    }
  }
  async function createAdminUser() {
    const department = await prisma.department.findFirst()
    const hashedPassword = await hash('admin', 8)
    await prisma.user.create({
      data: {
        firstName: 'Yuri',
        lastName: 'Muniz',
        password: hashedPassword,
        email: 'yuri@gruposina.com',
        role: 'INTERNAL_MANAGEMENT',
        createdAt: new Date(),
        status: 'ACTIVE',
        departmentId: department?.id,
      },
    })
    await prisma.user.create({
      data: {
        firstName: 'Luiza',
        lastName: 'Lins',
        password: hashedPassword,
        email: 'luizacampelomkt@gmail.com',
        role: 'INTERNAL_MANAGEMENT',
        createdAt: new Date(),
        status: 'ACTIVE',
      },
    })
    await prisma.user.create({
      data: {
        firstName: 'Luiz',
        lastName: 'Neto',
        password: hashedPassword,
        email: 'luiz@gmail.com',
        role: 'INTERNAL_MANAGEMENT',
        createdAt: new Date(),
        status: 'ACTIVE',
      },
    })
    await prisma.user.create({
      data: {
        firstName: 'Bruna',
        lastName: 'Lins',
        password: hashedPassword,
        email: 'brnalmaranhao@gmail.com',
        role: 'INTERNAL_MANAGEMENT',
        createdAt: new Date(),
        status: 'ACTIVE',
      },
    })
    await prisma.user.create({
      data: {
        firstName: 'Suzane',
        lastName: 'Lins',
        password: hashedPassword,
        email: 'suzanelins@hotmail.com',
        role: 'INTERNAL_MANAGEMENT',
        createdAt: new Date(),
        status: 'ACTIVE',
      },
    })
  }

  async function newCustomers() {
    for (let x = 0; x <= 10; x++) {
      const customer = await prisma.customer.create({
        data: {
          name: `Customer ${x}`,
          cnpj: `100012132/00${x}`,
          corporateName: `Name Customer ${x}`,
          contractDuration: '12 meses',
          contractValue: 100000,
          status: 'ACTIVE',
          createdAt: new Date(),
        },
      })

      await prisma.customerAddress.create({
        data: {
          street: faker.location.street(),
          city: faker.location.city(),
          country: faker.location.country(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          neighborhood: `bairro ${x}`,
          number: x.toString(),
          customerId: customer.id,
        },
      })
    }
  }

  return {
    createAdminUser,
    newCustomers,
    createDepartments,
  }
}
