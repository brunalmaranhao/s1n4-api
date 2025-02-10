import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { faker } from "@faker-js/faker";

export async function CreateInitialDataSeeder(prisma: PrismaClient) {
  async function createAdminUser() {
    const hashedPassword = await hash("admin", 8);
    await prisma.user.create({
      data: {
        firstName: "Yuri",
        lastName: "Muniz",
        password: hashedPassword,
        email: "yuri@gruposina.com",
        role: "INTERNAL_MANAGEMENT",
        createdAt: new Date(),
        status: "ACTIVE",
      },
    });

    // await prisma.user.create({
    //   data: {
    //     firstName: 'Luiza',
    //     lastName: 'Sina',
    //     password: hashedPassword,
    //     email: 'luiza@gruposina.com',
    //     role: 'INTERNAL_MANAGEMENT',
    //     createdAt: new Date(),
    //     status: 'ACTIVE',
    //   },
    // })
    // await prisma.user.create({
    //   data: {
    //     firstName: 'Raul',
    //     lastName: 'Sina',
    //     password: hashedPassword,
    //     email: 'raul@gruposina.com',
    //     role: 'INTERNAL_MANAGEMENT',
    //     createdAt: new Date(),
    //     status: 'ACTIVE',
    //   },
    // })
    // await prisma.user.create({
    //   data: {
    //     firstName: 'Luiz',
    //     lastName: 'Sina',
    //     password: hashedPassword,
    //     email: 'luiz@gruposina.com',
    //     role: 'INTERNAL_MANAGEMENT',
    //     createdAt: new Date(),
    //     status: 'ACTIVE',
    //   },
    // })
    // await prisma.user.create({
    //   data: {
    //     firstName: 'Carol',
    //     lastName: 'Sina',
    //     password: hashedPassword,
    //     email: 'carol@gruposina.com',
    //     role: 'INTERNAL_MANAGEMENT',
    //     createdAt: new Date(),
    //     status: 'ACTIVE',
    //   },
    // })
  }

  async function newCustomers() {
    for (let x = 0; x <= 10; x++) {
      const customer = await prisma.customer.create({
        data: {
          name: `Customer ${x}`,
          cnpj: `100012132/00${x}`,
          corporateName: `Name Customer ${x}`,
          contractDuration: "12 meses",
          contractValue: 100000,
          status: "ACTIVE",
          createdAt: new Date(),
        },
      });

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
      });
    }
  }

  return {
    createAdminUser,
    newCustomers,
  };
}
