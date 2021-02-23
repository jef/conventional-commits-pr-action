# conventional-commits-pr-action

Lints pull requests based on [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## Usage

```yaml
name: Pull Request Linter
on:
  pull_request:
    types:
      - opened
      - edited
      - reopened
jobs:
  lint:
    name: Lint pull request title
    runs-on: self-hosted
    steps:
      - name: Lint pull request title
        uses: jef/conventional-commits-pr-action@v1
```

## Inputs

- `token` [**Required**]: Access token to the repository. Usually `GITHUB_TOKEN`.

## Outputs

None.

## Contributing

There are few npm tasks that will help you in building and packaging. All commands are prefaced by `npm run`.

- `build`: builds the action.
- `compile`: transpiles TypeScript.
- `clean`: removes `build` directory.
- `fix`: fixes lint and format issues.
- `lint`: runs linter and checks format issues.
- `start`: runs the action.
- `test`: tests the action.
