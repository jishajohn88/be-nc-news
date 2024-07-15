# Northcoders News API

# Setting Environment Variables

- When using node-postgree to query databases it is necessary to specify which should be connected to. This is acheived by setting the environment variable called PGDATABASE.

- To acheive this securely is by making use of npm package dotenv where the variables are set into separate file called .env and add them to .gitignore as we don't want others to know about the database we are using

- Create a file called .env.test and add "PGDATABASE=nc_news_test" to run the test database

- Create a file called .env.development and add "PGDATABASE=nc_news" to run the development database

- In the terminal, run the following :
  1. npm run setup-dbs
  2. npm run seed (to check if it gets connected to development database)
  3. npm run test (to check if it gets connected to test database)

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
