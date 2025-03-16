import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })
  app.useLogger(['log', 'error', 'warn', 'debug']) // Inclui 'debug'
  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  app.enableCors({
    origin: [
      'http://localhost:3333',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://sina-web.vercel.app',
      'https://sina-web-5p44.vercel.app',
      'https://gruposina.com',
      'https://s1n4-web.vercel.app'
    ],

    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  })

  await app.listen(port)
}
bootstrap()
