#!/usr/bin/env node

const semver = require('semver')
const pkg = require(require('path').join(process.cwd(), 'package.json'))
const exec = require('child_process').execSync

try {
  const latestPublishedVersion = JSON.parse(exec(`npm info ${pkg.name} --json`).toString()).versions.pop()

  if (!semver.gt(pkg.version, latestPublishedVersion)) {
    console.log(`No update required. This build is for version ${pkg.version}. The latest published to npm is ${latestPublishedVersion}.`)
    process.exit(0)
  }

  console.log(`Update release from ${latestPublishedVersion} --> ${pkg.version}`)
} catch (e) {
  if (e.message.toLowerCase().indexOf('is not in the npm registry') < 0 && process.argv.indexOf('--allowInitialNpmPublish') < 0) {
    console.log(e)
    process.exit(1)
  }

  console.log(`Tagging initial version @${pkg.version}.`)
}

let remote = process.env.DRONE_GIT_HTTP_URL.replace('://', '://' + process.env.GIT_USER + ':' + process.env.GIT_SECRET.replace('@', '%40') + '@');

exec(`git remote rm origin && git remote add origin ${remote}`)
exec(`git tag ${pkg.version} && git push origin master --tag`)
