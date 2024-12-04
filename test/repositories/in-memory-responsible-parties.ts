import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ResponsiblePartiesEditProps } from '@/core/types/responsilbe-parties-props'
import { ResponsiblePartiesRepository } from '@/domain/project/application/repositories/responsible-parties'
import { ResponsibleParties } from '@/domain/project/enterprise/entities/responsibleParties'
import { Status } from '@prisma/client'

export class InMemoryResponsiblePartiesRepository
  implements ResponsiblePartiesRepository
{
  public items: ResponsibleParties[] = []

  async fetchBirthdaysOfTheMonth(
    params: PaginationParams,
  ): Promise<ResponsibleParties[]> {
    const today = new Date()
    const month = today.getMonth() + 1

    const birthdaysOfTheMonth = this.items.filter((responsible) => {
      const responsibleBirthdate = new Date(responsible.birthdate)
      return responsibleBirthdate.getMonth() + 1 === month
    })

    return birthdaysOfTheMonth
  }

  async fetchBirthdaysOfTheDay(
    params: PaginationParams,
  ): Promise<ResponsibleParties[]> {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const birthdaysOfTheDay = this.items.filter((responsible) => {
      const responsibleBirthdate = new Date(responsible.birthdate)
      return (
        responsibleBirthdate.getMonth() + 1 === month &&
        responsibleBirthdate.getDate() === day
      )
    })

    return birthdaysOfTheDay
  }

  async fetchCustomerResponsibleParties(
    customerId: string,
    params: PaginationParams,
  ): Promise<ResponsibleParties[]> {
    const responsibleParties = this.items.filter(
      (responsible) => responsible.customerId.toString() === customerId,
    )
    return responsibleParties
  }

  async create(
    ResponsibleParties: ResponsibleParties,
  ): Promise<ResponsibleParties> {
    this.items.push(ResponsibleParties)

    DomainEvents.dispatchEventsForAggregate(ResponsibleParties.id)
    return ResponsibleParties
  }

  async findByEmail(email: string): Promise<ResponsibleParties | null> {
    const ResponsibleParties = this.items.find((item) => item.email === email)

    if (!ResponsibleParties) {
      return null
    }

    return ResponsibleParties
  }

  async findById(
    ResponsiblePartiesId: string,
  ): Promise<ResponsibleParties | null> {
    const ResponsibleParties = this.items.find(
      (item) => item.id.toString() === ResponsiblePartiesId,
    )

    if (!ResponsibleParties) {
      return null
    }

    return ResponsibleParties
  }

  async update(
    ResponsiblePartiesId: string,
    ResponsibleParties: ResponsiblePartiesEditProps,
  ): Promise<ResponsibleParties> {
    const ResponsiblePartiesIndex = this.items.findIndex(
      (item) => item.id.toString() === ResponsiblePartiesId,
    )

    return (this.items[ResponsiblePartiesIndex] =
      ResponsibleParties as ResponsibleParties)
  }

  async findAll({ page }: PaginationParams): Promise<ResponsibleParties[]> {
    const answers = this.items.slice((page - 1) * 20, page * 20)

    return answers
  }

  async fetchByStatus(
    status: Status,
    { page }: PaginationParams,
  ): Promise<ResponsibleParties[]> {
    const ResponsibleParties = this.items.slice((page - 1) * 20, page * 20)

    return ResponsibleParties
  }

  async remove(id: string): Promise<void> {
    const ResponsibleParties = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!ResponsibleParties) {
      throw new Error('Responsible Parties not found')
    }

    ResponsibleParties.status = 'INACTIVE'
  }
}
