<!--<a href="http://yetijs.com"><img src="http://yetijs.com/images/yeti.svg" width="25%" height="25%"></a>-->
# YetiJS - A Node CMS
[![Build Status](https://travis-ci.org/Enmadaio/yeti.svg?branch=develop)](https://travis-ci.org/Enmadaio/yeti)
[![Coverage Status](https://coveralls.io/repos/Enmadaio/yeti/badge.svg?branch=master&service=github)](https://coveralls.io/github/Enmadaio/yeti?branch=master)
[![David Dependencies](https://david-dm.org/enmadaio/yeti.svg)](https://david-dm.org/enmadaio/yeti.svg)
[![Code Climate](https://codeclimate.com/github/Enmadaio/yeti/badges/gpa.svg)](https://codeclimate.com/github/Enmadaio/yeti)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Enmadaio/yeti?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

Yeti is a very fast and lightweight CMS built entirely in the MEAN stack.

#Angular 2
Coming soon! Check out the Angular2 branch for progress!

#Features
* WYSIWYG editing
* Full Javascript and CSS editing and embedding
* Blogging capabilities
* Full server-side rendering and caching for super fast page load times (sub 0.5s times very possible, average is under 1 second)
* Security backed by bcrypt (blowfish)
* Actively being developed

#Installation
1. Install <a href="https://nodejs.org/en/download/package-manager/">NodeJS</a>
2. Install <a href="https://docs.mongodb.org/manual/installation/">MongoDB</a>
3. Install <a href="http://www.imagemagick.org/script/binary-releases.php">ImageMagick</a> (This is needed for the gallery feature)
  * MacOS: brew install imagemagick
4. ```git clone https://github.com/Enmadaio/yeti```
5. ```npm install```
6. ```bower install```
7. ```npm start```
  * follow prompts to create config file and first user name
8. Check out your new site at http://localhost:3000 (Where 3000 is the port your specified in setup prompts)

<!--#Screenshots
####Views Screen
<img src="http://www.yetijs.com/images/yeti-view-demo.jpg">
####Blog Post Block Setup
<img src="http://www.yetijs.com/images/yeti-blogblock-demo.jpg">
####Real world benchmark of yetijs.com
<img src="http://www.yetijs.com/images/demo-gtmetrix.jpg">
####WYSIWYG Editor
<img src="http://www.yetijs.com/images/yeti-editor-demo.jpg">-->

More info coming soon, this is in very very early alpha. If you want to get involved just let me know.

#Official Site
[YetiJS](http://yetijs.com) - Created entirely and maintained with itself (very meta huh?)

# Demo
<a href="http://demo.yetijs.com" target="_blank">Yeti Demo</a><br>
User: demo<br>
Password: pass<br>

# Todo
- [X] Server Unit/Integration Tests
- [ ] Client Unit/Integration Tests
- [ ] Theming
- [ ] Plugins
- [ ] Error handling throughout
- [ ] Backup/restore within admin panel
- [X] CLI for first install/setup
- [ ] Settings page in admin panel
- [ ] Built-in SEO settings
- [ ] Social login/register
- [ ] Keep state in browser when returning to certain pages (possibly in URL, maybe in localstorage)
- [ ] Some sort of help screens (overlay on each screen illustrastrating how to use) on first use. Interactive tutorial
- [ ] Create videos for website
- [ ] Redesign yetijs.com to include new UI and some more details

#Mission Statement
This started as a personal project purely for fun and quickly turned into a viable product. I decided to open source it because I believe that community supported software produces a better product. Feel free to hack away on it and put up PRs. I am very busy professionally, but try to spend all of my free time on this project. I welcome any and all help available. Enjoy!