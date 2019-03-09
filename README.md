# @author.io/cicd-autotag

This Node.js-based CLI utility that will auto-tag node modules in git, according to their semantic version number. It is designed for use with drone.io, github, and npm. More specifically, it is used to respond to push/PR events on Github. When a new commit is pushed to master, drone.io responds and runs build steps. One of these steps can be an auto-tagger, which will automatically create a git tag and push it to Github. This, in turn, can trigger a Github Release and/or an npm publish.

1. Push code to master with a new version in `package.json`.
1. Drone.io runs this utlity.
1. This utility determines whether the new version has been published to npm yet.
1. If a new version needs to be release on npm, a git tag is created representing the code which should be published to npm.
1. A separate drone.io process can respond to tags (such as a new github release or npm publish).

## Installation & Usage

_Installation_

`npm i @author.io/cicd-autotag`

_Usage_

Drone.io uses a `.drone.yml` file to configure build "steps". This module can be used to facilitate auto-tagging.

For example:

```yml
kind: pipeline
name: release

steps:
  - name: autotag
    image: node
    environment:
      GIT_USER:
        from_secret: GITHUB_USERNAME
      GIT_SECRET:
        from_secret: GITHUB_KEY
    commands:
      - npm install -g @author.io/cicd-autotag
      - autotag
    when:
      event:
        - push
```

## Initial Releases (new npm modules)

By default, autotag will **not** succeed if it cannot find the npm module in the
npm registry. This feature prevents accidental publishing of new modules.

However; there are circumstances where new modules _should_ by published. To do
this, pass the `--allowInitialNpmPublish` flag to the command. For example:

```yml
commands:
  - npm install -g @author.io/cicd-autotag
  - autotag --allowInitialNpmPublish
```
