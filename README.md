# Coding Test Backend

## Requirements

### Node

- [Download](https://nodejs.org/en/download/)
- [Install via package manager](https://nodejs.org/en/download/package-manager/)
- [Node Version Manager](https://github.com/nvm-sh/nvm)

### Yarn

- [Install](https://classic.yarnpkg.com/en/docs/install/)

## Installation

```bash
yarn
```

## Running the app

It will start the app on http://localhost:3000

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn build
yarn start:prod
```

## Dev tools

```bash
# Check format errors
yarn format:check

# Check lint errors
yarn lint:check

# Check dead code
yarn tsprune

# Check all: format, lint, tsprune, tests
yarn check:all
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Resources

- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [ts-prune](https://github.com/nadeesha/ts-prune)
