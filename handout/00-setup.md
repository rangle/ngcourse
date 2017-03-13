# Part 0: Setup

Each attendee should come to the course with their own computer, so that they
can follow the steps. We also ask all attendees to complete the following
installation items before the first day of the course.

## The Command Line Terminal

The AngularJS tool-chain is quite command-line oriented, so we recommend
installing a good command-line terminal program. For __Mac OS X__ we recommend
[iTerm2](http://iterm2.com/).

For __Windows__, we'll be using `Git Bash`, which comes with `git`, below.

## Git

We'll be using `git` from the command line:

<http://git-scm.com/download/>

__Windows Users__: Just select the default options in the installation wizard.

__Windows Users__: The rest of this course assumes you are using the terminal
that comes with `git` (`Git Bash`) to run all command-line examples.

There are tools that provide a GUI interface for `git`, for both OS X and
Windows. Attendees who are proficient with `git` and prefer to use those tools
can do so if they wish. However, all of our instructions will be for the
command line, so we recommend having this available as a backup.

## Node.JS

<http://nodejs.org/download/>

This should install two commands: `node` and `npm`.

`npm` may require some extra configuration to set permissions properly on your
system.

On __Mac OS X__, do the following:

```sh
npm config set prefix ~/.npm
echo 'export PATH="$PATH:~/.npm/bin"' >> ~/.bashrc
~/.bashrc
```

On __Windows__, fire up `Git Bash` and type the following:

```sh
mkdir /c/Users/$USER/AppData/Roaming/npm
echo 'export PATH="$PATH:/c/Program Files/nodejs"' >> ~/.bashrc
~/.bashrc
```
__Note:__ if you installed the 32-bit Windows version of node, the second line
above should instead read:

```
echo 'export PATH="$PATH:/c/Program Files (x86)/nodejs"' >> ~/.bashrc
```

## Google Chrome and Batarang

Please install a recent version of Google Chrome, since we'll be using
tools that assume it.

Once you have installed Chrome, please install Angular Batarang, which is an
Google Chrome extension that makes it easier to debug and inspect Angular
applications. You can get it from the
[Google Webstore](https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk?hl=en)

## A Code Editor

Any text editor will work. At Rangle.io the most popular editors/IDEs are:

* [VS Code](https://code.visualstudio.com/)
* [Sublime Text](http://www.sublimetext.com/)
* [Atom](https://atom.io/)
* [WebStorm](https://www.jetbrains.com/webstorm/)
* Vim

## Verifying the Setup

Once you have all the tools set up correctly, you should be able to do the
following steps through the command line. This is the best way to check that
`git`, `node`, and `npm` were installed correctly.

Clone the training repository:

```sh
  git clone https://github.com/rangle/ngcourse.git
  cd ngcourse
```

Switch to the `cbc-training` branch:

```sh
  git checkout cbc-training
```

`cd` into the client folder and install the project's `npm` dependencies:

```sh
  cd client
  npm install
```

*If you get an error while running this command, see the next section.*

Install `gulp`

```sh
  npm install -g gulp
```

Install `http-server` and `json-server` using `npm`:

```sh
  npm install -g http-server json-server
```

Fire up the server:

```sh
  http-server client/
```

Fire up the json-server in another shell/cmd:

```sh
  json-server --watch db.json
```

Once you've run those commands, you should be able to access the server at
<http://localhost:8080>. If you see a login form at this point, then you did
everything correctly and are ready for the course.

## Proxy Issues

While running the above commands you might get errors related to proxies.  If
this is the case, you'll need to configure your command-line tools to handle
proxies.

### Git
This most likely means that you are behind a proxy that blocks SSH access to
Github. In this case, run the following command:

```sh
  git config --global url."https://".insteadOf git://
```

Then re-run the failed command.

It's a somewhat blunt weapon, but should work in most cases. If this doesn't
work, and if you know the URL of your proxy server, you can try this:

```sh
git config —global http.proxy <proxy server url>
```

### npm

```sh
npm config set proxy <proxy server url>
```
