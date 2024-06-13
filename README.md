# Cat Cards

> Coding Pagoda - Beginner [YouTube Videos](https://todo.com)

More details can be found in the [product brief](https://github.com/Svjard/catcards/wiki/Product-Brief)

A coding pagoda project that lets you utilize your skills to build a real-world application. To get started,

1. Create a new repository called `catcards` in Github for yourself
2. Clone the repo
3. Delete the .git directory
4. Run `git init` in the directory
5. Add the new repository origin `git remote add origin https://github.com/{username}/catcards.git` replacing {username} with your own Github username

You can work through the building out the application however you wish but a project template is provided for you to learn additional skills such as planning, estimating, breaking down tasks, and general agile development. To use the template, visit the [project board](https://github.com/users/Svjard/projects/4/views/2?groupedBy%5BcolumnId%5D=Milestone) to start and follow these steps.

1. Go to https://github.com/{username}/catcards/milestones replacing {username} with your own Github username
2. Add the milestones, copying and pasting from the project board
3. Go to https://github.com/{username}/catcards/projects replacing {username} with your own Github username
4. Create a new project of type Kanban
5. Go to the [backlog view](https://github.com/users/Svjard/projects/4/views/1) and copy issues over into your own repository. Yes this is tedious but Github doesn't provide a better way. Part of this exercise is to also absorb the project breakdown in having to copy over the content.
6. Be sure to attach each issue you create to the correct milestone and the project you have created for yourself.
7. Start Coding!

Note that every issue has an associated PR to provide help along the way. Try not to look until you have put in an effort to complete each task on your own first though.

## Overview

A digital card view of the equipment offered by Caterpillar with important specifications and the ability to navigate via equipment categories.

## Features

- See equipment across all categories that Caterpillar sells for
- Search/filter for a particular piece of equipment
- Change between Metric and English unit systems

## Running Locally

```
npm ci
npm run start
```

Then just open a browser and enter the url: http://localhost:8080. As you make changes you can refresh the browser and any changes
will automatically be visible.

## Testing

All tests are written using cypress and live in the cypress/ folder. The focus of the tests is on capturing the major user interactions in the application and verifying correct functionality.

To run the E2E tests locally follow these steps:

In one console run

```
npm run start
```

In a seperate console run

```
npm run cypress
```

## Deployment

To get started with deployment first install the AWS CDK globally using the following
command:

```
npm install -g aws-cdk
```

## Scripts

### Data Collection

All data is scraped from the main Caterpillar website using puppeteer. At anytime, the scraper can be re-run against the current dataset on the website using the following command:

```
node scripts/scaper.js
```

The output will stored into data/equipment.json.
