import { NestFactory } from '@nestjs/core'
import * as fs from 'fs'
import * as path from 'path'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { getRemixHandler, broadcastOnReady, PUBLIC_PATH } from './remix'
import * as serveStatic from 'serve-static'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { exec } from 'child_process'

const PORT = parseInt(process.env.PORT || '3000', 10)
// const API_DOCS_PATH = path.resolve(__dirname, '..', 'src', 'api_docs')
const API_DOCS_PATH = path.resolve(process.cwd(), 'src', 'api_docs')
// const API_DOCS_PATH = path.resolve(__dirname, 'src', 'api_docs')
console.log('apidocsmath', API_DOCS_PATH)
const SWAGGER_PATH = path.join(API_DOCS_PATH, 'swagger.json')
const SWAGGER_UI_PATH = 'api-docs'

async function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('Rules Engine API')
    .setDescription('API documentation for the Rules Engine')
    .setVersion('1.0')
    .addTag('rules', 'Rule management endpoints')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // Ensure docs directory exists
  if (!fs.existsSync(API_DOCS_PATH)) {
    fs.mkdirSync(API_DOCS_PATH, { recursive: true })
  }

  // Write swagger.json
  fs.writeFileSync(SWAGGER_PATH, JSON.stringify(document, null, 2))

  // Setup Swagger UI
  SwaggerModule.setup(SWAGGER_UI_PATH, app, document)

  if (process.env.NODE_ENV === 'development') {
    // Watch for changes to swagger.json and regenerate types if necessary
    fs.watch(path.join(API_DOCS_PATH, 'swagger.json'), (eventType) => {
      if (eventType === 'change') {
        exec('yarn run generate:api', (error, stdout, stderr) => {
          if (error) console.error('Error regenerating types:', error)
          else console.info('Types regenerated')
        })
      }
    })
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api')
  app.enableCors()

  const express = app.getHttpAdapter().getInstance()
  express.all('*', await getRemixHandler())
  express.use(serveStatic(PUBLIC_PATH, { index: false }))

  await setupSwagger(app)
  await app.init()

  app.listen(PORT).then(() => {
    console.log(`> Server ready on http://localhost:${PORT}`)
    console.log(
      `> API Documentation available at http://localhost:${PORT}/${SWAGGER_UI_PATH}`,
    )
    broadcastOnReady()
  })

  return app
}

bootstrap()
