# Bruno API documentation

Open `personalized-recommendation-api` as a collection in Bruno and select the `local` environment.

## Run order

1. Start MongoDB and the API with `npm --prefix server start`.
2. Run `Health check`.
3. Run `Register user`, then `Login user`. The login response stores `token` and `userId` in the environment.
4. Run the protected recommendation and upload requests.
5. Set `recommendationId` and `resourceId` from create/list responses before running their detail, update, or delete requests.

The collection covers health, authentication, user CRUD, recommendation CRUD, and authenticated resource upload/delete endpoints.
