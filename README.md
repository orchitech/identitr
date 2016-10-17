# Identitr - The First IdM Game

Simple drag&drop game based on Identity Management.

Created for CESNET's  [University identities 2016 conference](https://www.cesnet.cz/sdruzeni/akce/univerzitni-identity-2016/) in a very limited time :).

## Installation

    npm install

    # Create `identitr` database in PostgreSQL
    psql -U identitr -f src/server/schema.sql

    # Run the server
    npm run server:prod

## License

Game files are licensed under Apache License, Version 2.0. Project was created using [angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter) skeleton, which is licensed under MIT license.
