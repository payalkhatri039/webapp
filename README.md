# Web Application


# Reference links:

1. https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
2. https://www.geeksforgeeks.org/basic-authentication-in-node-js-using-http-header/
3. https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
4. https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows
5. https://stackoverflow.com/questions/73755006/how-to-find-out-if-the-github-actions-event-that-triggered-the-current-workflow
6. https://github.com/github/gitignore/blob/main/Packer.gitignore
7. https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions

# API Checks Covered For Healthz:

1. No query params accepted.
2. No Request method except Get accepted for healthz.
3. No request method except Get, Post and Put for user APIs.
4. No payloads accepted in requests and responses for healthz.
5. Only authorized users can perform Get and Put operations.
6. Allowing only valid JSON schemas for user APIs.
7. Checking if exists or not for user APIs.
8. Checking for correct URLs.
9. Verified the success and failure by shutting down the database server while the application is still running.
10. Restarting the database without restarting the application works.
11. Head and Options are restricted.

# Git Action

1. Integration tests are run at pull request and merge request
2. Packer is initialized and validated. Artifact for the image are built from the Github repository
3. Machine image is built on the runner after pull request is merged


# Command to run locally :

npm install
npm start

# Hit API on Postman

1. For Healthz: https://payalkhatri.me/healthz
2. For User Post: https://payalkhatri.me/v1/user
3. For User Get/Put: https://payalkhatri.me/v1/user/self


# IAM Service account has roles:

1. Compute Instance Admin (v1)
2. Service Account User
