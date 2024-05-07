# Query App

Query Apps empowers developers to create side-projects and startups generating code, saving development time and effort while maintaining consistency and quality. The [Query Generator](https://github.com/gc-victor/query/tree/main?tab=readme-ov-file#generator) generates code based on the templates defined. These templates are designed to automate the creation of **APIs, Admin UI, database migrations and validations**.

The most important part is that it is entirely customizable. You can create your own templates and use them to generate code for your [Query](https://github.com/gc-victor/query) projects.

## Quick Start

To get started with the Query App locally, you have to execute a command:

```bash
pnpm dlx @qery/query create
```

OR

```bash
npx @qery/query create
```

And choose the `Application` project.

Now you can open the app in your browser <http://localhost:3000/admin>. You have to use the `email` (admin) and `password` (admin) you set during the creation in the `.env` file to login.

## Run Query Server On Fly.io

We recommend using Query with Fly (<https://fly.io>). It will help you deploy your application quickly and replicate it worldwide.

For more information, [Run Query Server On Fly.io](https://github.com/gc-victor/query?tab=readme-ov-file#run-a-query-server-on-flyio).

## Deploy - GitHub Actions

The Query App uses GitHub Actions to automate the deployment process.

First, you have to rename the `.github/_workflows` directory to `.github/workflows`.

Then, you have to set a couple of variables in the **GitHub repository settings**:

- `QUERY_APP_QUERY_SERVER`: Your server's URL.
- `QUERY_PRIVATE_TOKEN`: As a **secret**, your server's admin token.

To get the admin token, you have to run the following command:

```bash
query user-token value
```

When you push to the `main` branch, it will deploy the app to your server.

## Related information

- [Query](https://github.com/gc-victor/query)

- [Query Function](https://github.com/gc-victor/query/tree/main?tab=readme-ov-file#function)

- [Query Assets](https://github.com/gc-victor/query/tree/main?tab=readme-ov-file#asset)

- [Query Generator](https://github.com/gc-victor/query/tree/main?tab=readme-ov-file#generator)

- [Query Server App](https://github.com/gc-victor/query/tree/main?tab=readme-ov-file#query-server-app)
