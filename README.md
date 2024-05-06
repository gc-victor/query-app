# Query App

Query Apps empowers developers to create side-projects and startups generating code, saving development time and effort while maintaining consistency and quality. The [Query Generator](https://github.com/gc-victor/query/tree/main?tab=readme-ov-file#generator) generates code based on the templates defined. These templates are designed to automate the creation of **APIs, Admin UI, database migrations and validations**.

The most important part is that it is entirely customizable. You can create your own templates and use them to generate code for your [Query](https://github.com/gc-victor/query) projects.

## Quick Start

To get started with the Query App locally, you need to follow these steps:

1. Clone this repository

    ```bash
    git clone https://github.com/gc-victor/query-app
    ```

2. Change the directory to the `query-app`

    ```bash
    cd query-app
    ```

3. Install the dependencies

    ```bash
    pnpm install
    ```

4. Setup Query

    Let's start with the environment variables

    ```bash
    cp .env.dist .env
    ```

    Open the `.env` file and set:
    - **QUERY_SERVER_TOKEN_SECRET**: You can generate one using OpenSSL.

        Example: `openssl rand -hex 32`

    - **QUERY_SERVER_ADMIN_EMAIL**:  Add your email or use `admin` for local development
    - **QUERY_SERVER_ADMIN_PASSWORD**: Add a password or use `admin` for local development

    Let's finish with the settings

    ```bash
    query settings
    ```

    For local development, use the following settings:

    - **URL**: `http://localhost:3000`
    - **Email**: `admin`
    - **Password**: `admin`

5. Run the server

    ```bash
    make server -s
    ```

6. Run the watcher

    ```bash
    make watch -s
    ```

7. Run the default migrations

    ```bash
    query migration admin_user_session.sql migrations/admin_user_session.sql/20240116141458-admin_session-up.sql && \
    query migration post.sql migrations/post.sql/20240117102216-post-up.sql
    ```

8. Generate your first entity

    ```bash
    query generate test.sql test active:boolean title:string content:text number:integer
    ```

    It requires to run the migration generated:

    ```bash
    query migration test.sql migrations/test.sql/__USE_THE_FILE_GENERATED__
    ```

Now you can open the app in your browser http://localhost:3000/admin/test. You have to use the `email` and `password` you set in the `.env` file to login.

## Run Query Server On Fly.io

We recommend using Query with Fly (https://fly.io). It will help you deploy your application quickly and replicate it worldwide. 

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
