## Описание сервера

- Сервер написан на Nest.js;
- База данных MongoDB;
- Для работы по протоколу https использован Nginx;
- Сертификат безопасности SSL выдан Let's Encrypt;
- В документации не указаны \_id но они есть у всех объектов MongoDB их генерирует автоматически.
- Документация к API выполена в Swagger [открыть её](https://jh0ske.tk/docs) в своём браузере.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
