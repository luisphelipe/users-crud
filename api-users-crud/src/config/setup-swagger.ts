import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setup_swagger = (app: INestApplication) => {
    const config = new DocumentBuilder().addBearerAuth().setTitle('CRUD API').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);

    const custom_swagger_ui_config = {
        customSiteTitle: 'CRUD API',
        swaggerOptions: { defaultModelsExpandDepth: -1, persistAuthorization: true },
        customCss:
            '#swagger-ui > section > div.swagger-ui > div:nth-child(2) > ' +
            'div:nth-child(4) { margin-bottom: 80px; }\n' +
            '.response-controls { display: none !important; }\n' +
            '.content-type { display: none !important; }\n',
    };

    SwaggerModule.setup('api', app, document, custom_swagger_ui_config);
};
