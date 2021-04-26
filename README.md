# AWS Image Processing

This monorepo contains a dummy distributed image processing system using AWS utilities (S3, SQS) and Node JS.

# Requirements

- Node 12+
- Yarn 1.22+

# How to run

- Clone the repository and set PWD to the project directory.
- Create a .env file from example.env and fill in the blank fields with appropriate values
- Install node modules using the command: `yarn` or `yarn install`
- Start server using command: `yarn server` or `npm run server`
- Spawn worker using command: `yarn worker` or `npm run worker`

You will be able to browse the frontend in: http://localhost:5000/
