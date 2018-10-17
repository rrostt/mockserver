# Mockserver

Super simple implementation to mock calls to run on a remote server. Usable when server must be accessible from code running remotely.

## API

`POST /_mock`

with payload

    {
        baseUrl,
        method = 'GET',
        response,
        statusCode = 200
    }

Will make sure that a call to

`GET baseUrl`

will return response and statusCode as status code.
