The Dudar project is a service to learn how to play bagpipe.
Works with MIDI, Tone.js

# Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm build`

# Local development with Lando (with containers)
This set up utilizes Docker containers and may be used on any platform. It is especially recommended for Windows users since it helps to avoid a bunch of environmental issues.

1. Install **Lando** from [https://docs.lando.dev/basics/installation.html]() (it supports Linux, OSX and Win10+)
2. Go to console and run `lando start` in the root folder. This will create you local environment:
    * create two virtual Docker containers:
      - with Node for dev server
      - with Apache for static builds
    * install all dependencies into containers
    * build the project into static files, available right away at https://dudar-build.lndo.site/
3. Now you can run the following *project specific* commands (described in `.lando.yml` tooling section):
  * `lando dev` - run the app in the development mode with live reload
  * `lando build` - build the project into static files
4. To see the static built version just open https://dudar-build.lndo.site/  in your browser
5. To start developing with live reload run `lando dev` in console and open https://dudar.lndo.site/ in your browser
