#!/bin/bash

nodemon --ignore dist --ext js,html,sh --exec "bash build.sh; twistd -n web --port 'tcp:port=7100' --path dist"
