<h1 align="center">
    <br>
  Fastify Typescript Mongoose Starter
  <br>
</h1>

<h4 align="center"> Fastify Rest API Boilerplate Using TypeScript and Mongoose</h4>
<h5 align="center">
  Taken and Modified from 
  <a href="https://github.com/TheB1gFatPanda/fastify-typescript-starter" target="_blank">
    <b>TheB1gFatPanda</b>
  </a>
 </h5>
 <br>
  <br>

## Features:

<p>
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
.env.test
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

### Swagger Endpoint:

http://localhost:3000/api-docs
