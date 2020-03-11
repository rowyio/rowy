#!/usr/bin/env node

import program from 'commander';
import fetchConfig from './fetchConfig';

program
  .usage("[global options] command")
  .option('-c, --credentials <path>', 'Specify path for service-account.json', 'GOOGLE_APPLICATION_CREDENTIALS or ./firebase-credentials.json')
  .on('option:credentials', function (path) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path;
  });

program
  .command('fetch-config')
  .description('Fetch firetable config from firestore')
  .option('-o, --output <path>', 'Specify path to write the config in file (if not defined outputs to STDOUT)')
  .action((options) => {
    return fetchConfig(options)
      .then(() => console.error("Config successfully fetched"))
      .catch((error) => {
        console.error("Something went wrong: ", error);
        process.exitCode = 1; 
      });
  })

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}