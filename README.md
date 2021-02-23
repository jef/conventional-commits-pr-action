# conventional-commits-pr-action

Lints pull requests based on [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

Also has the ability to post a comment in the pull request conversation with examples.

![image](https://user-images.githubusercontent.com/12074633/108867820-91325700-75c3-11eb-8820-4b55abe01c35.png)

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
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

- `comment`: Post a comment in the pull request conversation with examples. Default is `true`.
- `token` [**Required**]: Access token to the repository. Usually `${{ secrets.GITHUB_TOKEN }}`.

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
