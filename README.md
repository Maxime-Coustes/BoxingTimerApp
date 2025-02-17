# BoxingTimerApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



# Custom infos:
To build to project : ng build --configuration production     (it build the dist/ folder)

The go on /dist/boxing-timer-app/browser
and run   http-server --cors --spa


To access to it from mobile device go on http://192.168.X.XX:8080/
(check ifconfig  looking for 192.168...)


# BUILD APK

AFTER PURGE: (rm -rf /dist dans mon projet)
0- ng build --configuration production
1- npx serve dist/boxing-timer-app/browser/  afin d'exposer le port3000 (check  lsof -i :3000 &&  kill -9 <PID> if needed)
2- ngrok http 3000      pour obtenir une URL accessible depuis ton APK (check= ps aux | grep ngrok   && kill -9 <PID> if needed)
3- mettre à jour bubblewrap grace à la ligne Forwarding (ici localhost:3000)
MANUEL:
	bubblewrap init --manifest=http://localhost:3000/manifest.webmanifest --verbose
	Domain: la ligne Forwarding
	UrlPath /
	...
4- on build: bubblewrap build
5- on l'installe : adb install app-release.apk
dans mon cas, je copie le app-release-signed.apk vers une USB pour la mettre sur mon tel via un windows
AUTO:
cd /workspace/BoxingTimerApp/src/bash$ 
python3 build.py

Then, cp/paste app-release-signed.apk  on mobile for install
