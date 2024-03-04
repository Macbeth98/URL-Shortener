<h1 align="center">
    <br>
  URL-Shortener
  <br>
</h1>

<h4 align="center"> A URL Shortener implemented in Node-Typescript-Fastify-MongoDB/Mongoose</h4>
<h5 align="center">
  <b>Backend APIs at
  <a href="https://urlscut.co/" target="_blank">
    urlscuts.co/
  </a></b>
 </h5>
 <h5 align="center">
  <b>Swagger API Docs at
  <a href="https://urlscut.co/api-docs" target="_blank">
    urlscuts.co/api-docs
  </a></b>
 </h5>
 <br>
  <br>

## Features:

<p>
<a href="https://urlscut.co/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/URLShortener-blue?style=for-the-badge" />
  </a>&nbsp;&nbsp;
  <a href="https://www.fastify.io/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white" />
  </a>&nbsp;&nbsp;
  <a href="https://www.typescriptlang.org/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/-TypeScript-007ACC?style=for-the-badge&logo=TypeScript&logoColor=fff" />
  </a>&nbsp;&nbsp;
  <a href="https://nodejs.org/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=fff" />
  </a>&nbsp;&nbsp;
  <a href="https://mongoosejs.com/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/mongoose-%23880000?style=for-the-badge&logo=mongoose&logoColor=white"/>
  </a>&nbsp;&nbsp;
  <a href="https://www.mongodb.com/" target="_blank" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/MongoDB-%2347A248?style=for-the-badge&logo=mongodb&logoColor=black"/>
  </a>&nbsp;&nbsp;
</p>

<p>
  <a href="https://www.npmjs.com/" target="_blank">
    <img src="https://img.shields.io/badge/-NPM-CB3837?style=for-the-badge&logo=NPM&logoColor=fff" />
  </a>&nbsp;&nbsp;
  <a href="https://www.docker.com/" target="_blank">
    <img src="https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=fff" />
  </a>&nbsp;&nbsp;
  <a href="https://nodemon.io/" target="_blank">
    <img src="https://img.shields.io/badge/-Nodemon-76D04B?style=for-the-badge&logo=Nodemon&logoColor=fff" />
  </a>&nbsp;&nbsp;
  <a href="https://eslint.org/" target="_blank">
    <img src="https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=fff" />
  </a>&nbsp;&nbsp;
  <a href="https://prettier.io/" target="_blank">
    <img src="https://img.shields.io/badge/-Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=000" />
  </a>&nbsp;&nbsp;
  <a href="https://swagger.io/" target="_blank">
    <img src="https://img.shields.io/badge/-Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=000" />
  </a>&nbsp;&nbsp;
  <a href="https://swc.rs/" target="_blank">
    <img src="https://img.shields.io/badge/-SWC-FFFFFF?style=for-the-badge&logo=swc&logoColor=FBE1A6" />
  </a>
</p>

## How to use

### 1. Clone this repo & install dependencies

Install Node dependencies:

`npm install`

### 2. Create env files

Create the env files for dev, test and prod,
refer <span style="color:red;">env.example</span>

```sh
.env.development
.env.production
```

### 3. Set up the database

The boilerplate uses [MongoDB with Mongoose](https://mongoosejs.com/).

and update the db URI in the env file

### 4. Start the server

Launch your server with this command:

```sh
npm run dev
```

## Docker Image

- Pull the docker Image from here: https://urlscut.co/dockerimg || https://hub.docker.com/r/macbeth98/url-shortener
- Run the server by pulling the docker image. Check the `env.example` file for Docker related settings and based on that create or update the `.env.production` file.
- This file will be used by the docker-compose to inject the env variables.

```sh
docker-compose up -d
```

### Swagger Endpoint:

https://urlscut.co/api-docs

- The APIs are documented properly using the fastify-Swagger utility module.

### About the Design

- The App uses Fastify freamework instead of express. I have used this as Fastify boasts to be the fastest and with less overhead. Technically it would mean that fastify server would be able to handle more requests/sec. You can see the [benchmarks here](https://fastify.dev/benchmarks/).
- I have used Typescript so that my code will be clean and much readable. But also to reduce the run time errors. With Typescript I can do better apply the OOD principles.
- I have extensively used Dependency Injection wherever possible, as that would give us much better usecase in switching of services and also better tests!
- The fastify framework with it's plugins usually becomes tightly coupled as we would need to pass the fastify app instances into controller and even services to use the plugins and also for the corresponding constructor Injections.
  - To avoid that I created a `ServiceContainer` that essentially acts as the place where all the Classes will be instantiated and will be served wherever necessary through dependency Injection. This class will also hold fastify Plugins as properties and can be used anywhere through dependency Injection or directly importing the instance.
  - All the classes are singleton and are only instantiated once through `ServiceContainer` and `ServiceContainer` class itself is also instantiated only once.
  - Through this way instead of depending on the fastify Instance and fastify framework, the controller and service layer depends on this ServiceContainer. By doing this way, the app becomes platform independent and can easily switch between frameworks, by changing the routing layer and assigning proper corresponding ServiceContainer proprties.
- The app also seperates the **Data Access Object layer: communication with Database** through the use of Interfaces and Dependency Injection in the service layer. In this way, it will be easier to switch the Database.
- The design makes extensive use of this Interfaces and Dependency Injection, as can be seen from the DAOs and Auth Providers, where I have implemented two Auth Provider, one is Basic Auth and the Other is **AWS Cognito**.
- The folder or directory structure is also divided into modules, where in each module intiates its own services and its corresponding provider dependencies. This will be done at the bootup of the app through the ServiceContainer class.

### Shortening of URL

- I have used the counter approach to generate new Aliases that will be mapped to the long urls.
- I have chosen to do this way, because I want to generate new Alias irrespective of the long URL unless the user chose a custom Alias.
- The counter will keep getting increment for each URL and the number will be converted to base62 which will be used as the Alias.
- By following this approach trillions of unique Alias can be generated. As the number from the counter increases, the Alias will also increase.
- The current Alias will atleast have 4 characters in it.
- Read more about counter approach from [GeeksforGeeks](https://www.geeksforgeeks.org/system-design-url-shortening-service/#) : https://urlscut.co/counter

### Caching

- The server uses in memory cache, that is design similar **LRU (Least Recently Used)**, in conjunction with **Redis**.
- This makes the processing of Short URLs, much faster.

### Tests

- Written end to end tests by calling the routing apis through fastify inject.
- AUTH Router testing completed.
- URL Router testing completed.

### Hosting

- The server is hosted on the AWS EC2 instance through nginx proxy server.
- The server is also configured http2.
- As mentioned, the APIs are live at [urlscut.co](https://urlscut.co/)
