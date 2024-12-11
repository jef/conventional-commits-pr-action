# conventional-commits-pr-action

Lints pull requests based on [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

Also has the ability to post a comment in the pull request conversation with examples.

![image](https://user-images.githubusercontent.com/12074633/108867820-91325700-75c3-11eb-8820-4b55abe01c35.png)

Live examples:

- [With pull request comment](https://github.com/jef/conventional-commits-pr-action/pull/5)
- [Without pull request comment](https://github.com/jef/conventional-commits-pr-action/pull/4)

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
  lint-pr:
    name: Lint pull request title
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write # post comments when 'comment' is true
    steps:
      - name: Lint pull request title
        uses: jef/conventional-commits-pr-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

### `comment`

**Optional** Post a comment in the pull request conversation with examples.

| Default value | `true` |
|---------------|--------|

**Note**: commenting in the pull request conversation requires that the token is configured with the `pull-requests` permission.

### `token`

**Required** Access token to the repository. Usually `${{ secrets.GITHUB_TOKEN }}`.

## Contributing

There are few npm tasks that will help you in building and packaging. All commands are prefaced by `npm run`.

- `build`: builds the action.
- `clean`: removes `build` directory.
- `compile`: transpiles TypeScript.
- `fix`: fixes lint and format issues.
- `lint`: runs linter and checks format issues.
- `start`: runs the action.
- `test`: tests the action.
