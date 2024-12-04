import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import * as msal from '@azure/msal-node'
import { EnvService } from '../env/env.service'
import { Either, left, right } from '@/core/either'

export type GetRequestHeaderResponseProps = {
  'Content-Type': string
  Authorization: string
}

type MsalConfigProps = {
  auth: {
    clientId: string
    authority: string
    clientSecret?: string
  }
}

type GetRequestHeaderResponse = Either<
  UnauthorizedException,
  { header: GetRequestHeaderResponseProps }
>

@Injectable()
export class PbiAuthService {
  private tokens: Record<
    string,
    { accessToken?: string; expiresOn?: Date | null }
  > = {}

  constructor(private config: EnvService) {}

  private async generateAccessToken(
    type: 'management' | 'analysis',
  ): Promise<void> {
    const msalConfig: MsalConfigProps = {
      auth: {
        clientId: this.config.get('PBI_CLIENT_ID'),
        authority: `${this.config.get('PBI_AUTHORITY_URL')}${this.config.get('PBI_TENANT_ID')}`,
      },
    }

    const scopes = [
      this.config.get(
        type === 'analysis'
          ? 'PBI_SCOPE_BASE_ANALYSIS'
          : 'PBI_SCOPE_BASE_MANAGEMENT',
      ),
    ]

    let response: msal.AuthenticationResult | null = null

    if (this.config.get('PBI_AUTH_MODE').toLowerCase() === 'masteruser') {
      const clientApplication = new msal.PublicClientApplication(msalConfig)

      response = await clientApplication.acquireTokenByUsernamePassword({
        scopes,
        username: this.config.get('PBI_USERNAME'),
        password: this.config.get('PBI_PASSWORD'),
      })
    } else if (
      this.config.get('PBI_AUTH_MODE').toLowerCase() === 'serviceprincipal'
    ) {
      msalConfig.auth.clientSecret = this.config.get('PBI_CLIENT_SECRET')
      const clientApplication = new msal.ConfidentialClientApplication(
        msalConfig,
      )

      response = await clientApplication.acquireTokenByClientCredential({
        scopes,
      })
    }

    this.tokens[type] = {
      accessToken: response?.accessToken,
      expiresOn: response?.expiresOn,
    }
  }

  private isTokenExpired(type: 'management' | 'analysis'): boolean {
    const tokenInfo = this.tokens[type]
    if (
      !tokenInfo?.accessToken ||
      (tokenInfo.expiresOn && new Date() >= tokenInfo.expiresOn)
    ) {
      return true
    }
    return false
  }

  async getRequestHeader(
    type: 'management' | 'analysis',
  ): Promise<GetRequestHeaderResponse> {
    try {
      if (this.isTokenExpired(type)) {
        await this.generateAccessToken(type)
      }

      const token = this.tokens[type]?.accessToken
      if (!token) {
        return left(new BadRequestException('Token not found'))
      }

      return right({
        header: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (err) {
      return left(new UnauthorizedException(err?.toString()))
    }
  }
}
