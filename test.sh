#!/bin/sh

curl -s -d '{"baseUrl":"/test", "response":"hello there"}' --header "Content-Type: application/json" http://localhost:3000/_mock > /dev/null
curl http://localhost:3000/test
echo
