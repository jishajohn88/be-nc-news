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

- Check my hosted version of the API - https://nc-news-0xna.onrender.com/

- The project includes the varioud endpoints to get data regarding the users,topics, articles and also you can find out how many comments you got for a particular article

- Follow the instructions to use my git repo and running it locally in your own machine:

1.  Login into your github account, go to https://github.com/jishajohn88/be-nc-news
2.  Click on 'Code' to get the link to clone the repo
3.  Open a terminal and go to the directory where you want to put the repo and type in git clone https://github.com/jishajohn88/be-nc-news.git
4.  Open the git repo in Visual Studio code by using code . in the terminal inside the directory where the repo lives and then in the terminal type npm install to install all the dependencies.
5.  In the terminal type in npm run psql -f ./db/setup.sql, followed by node ./db/seeds/run-seed.js and at last run npm test app.
6.  As part of running the repo you need to create 2 .env files which uses the development and test data.
7.  When tests are run it makes use of .env.test and when development is run it uses .env.development.
8.  Minimum versions required to run Node.js is v22.2.0 and Postgres is 8.12.0.

    This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
