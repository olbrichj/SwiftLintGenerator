# Installation
```sh
$ npm install
```
# Run
```sh
$ gulp build
```
open build/index.html

# Deploy to Firebase
Generate Firebase token:
```sh
$ firebase login:ci
```
Create file 'security.json' in main directory and
save Firebase token to security.json
```sh
{
  "FIREBASE_TOKEN": "token"
}
```
```sh
$ gulp deployPROD
```

## TODO
- update js packages
  - gulp requires changes, as gulp 4.x.x has breaking changes
  - gulp-file has been deprecated in favor of del
- rules are outdated probably require all new rules
- cors policy is broken, as rules are accessed via `file://` If you want to test it you can launch Chrome with `open -a "Google Chrome" --args --allow-file-access-from-files`
- Firebase deployment is currently broken (activate security.json again)
- Consent-Banner is broken (probably requires just an update)
- Privacy Policy needed to be deleted, so a new one is required

## Rules Template
```json
{
  "identifier": "<swiftlint-rule-identifier>",
  "name": "<rule name>",
  "description": "<rule description e.g. a question>",
  "example": "<example-code>",
  "opt_in": false // is this rule opt in?
}
```
### Syntax formatting
- Everything between `={ }=` is highlighted
- `\n` is a new line