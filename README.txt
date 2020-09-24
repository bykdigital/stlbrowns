# St. Louis Browns Historical Society

The internet home of the St. Louis Browns Historical Society.

## OVERVIEW

This website is a [Node](https://nodejs.org/en/)-based Javascript application, served by [Express](https://expressjs.com/). It was built using [Jade](http://jade-lang.com/) and [Mustache](https://github.com/janl/mustache.js) to render template content.

```text
.
├── package.json        -> npm config
├── server.js           -> main application entry point
├── gulpfile.js         -> gulp config
├── Public              -> current release client-side compiled
│   └── fonts           -> local fonts, excluding the Sentinel family
│   └── images          -> image assets
│   └── video           -> motion assets
├── Routes
│   └── api             -> api endpoints
└── Client              -> client-side source
    ├── js
    │   ├── app
    │   └── main.js     -> main client-side application
    └── css
        ├── base
        ├── generic
        ├── objects
        └── main.scss   -> source css
```


## DEVELOPMENT

First, check your Node version. This application was tested on version `8.17.0`, a.k.a `lts/carbon`.

Install package dependencies:
```
npm install
```

Run the site locally. It will be available at [http://localhost:8000](http://localhost:8000):
```
npm start
```

Launch a process to compile CSS and JS changes using Gulp:
```
npm run watch
``` 


## ASSET DELIVERY
Assets can either be served directly from the `Public` folder, or from a CDN of your choosing. 

You can define an asset path by modifying the `$cdn` SASS variable in `Client/css/_vars.scss` and editing the Javascript `cdn` property within `Client/js/app/Config.js`.

Also update the template `cdn` variable paths and `dns-prefetch` links within `Views/index.jade` and `Views/fallback/layout.jade`.

### IMPORTANT NOTE:

The Sentinel font used for body copy throughout the site was licensed for use by HLK through [typography.com](http://typography.com) and will soon expire. It should be replaced by a version licensed through your organization. Please edit the following line in `Views/index.jade` to point to your source:
```
link(rel="stylesheet", type="text/css", href="//cloud.typography.com/7547052/652786/css/fonts.css")
```

## HOW TO DEPLOY

Always run the following command to minify scripts and styles and compress images before a production deployment:
```
npm run compress
```

Use your preferred manual or CI/CD method to transfer the files to a server that supports Node applications and install the dependencies.  

Optionally, transfer your font and image assets to a CDN. The asset paths should be root-relative, mirroring the structure inside of `Public`.

Follow your hosting provider's instructions for launching the main application file `server.js`. Many environments utilize [PM2](https://pm2.keymetrics.io/) for managing Node applications processes.

Use of [nginx](http://nginx.org/) or similar software will be required to proxy the express app running on port 8000 to a virtual host listening at your desired *hostname.domain* on port 80.
