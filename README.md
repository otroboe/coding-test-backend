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

- It will start the app on http://localhost:3000.
- A playground is available on http://localhost:3000/graphql to try it out.

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
# Run tests
yarn test

# Run tests with coverage
yarn test:cov
```

## Resources

- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [ts-prune](https://github.com/nadeesha/ts-prune)
