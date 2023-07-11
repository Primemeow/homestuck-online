#!/bin/bash
set -e

# Run the build command
echo "Building application..."
yarn build

# SSH into the server and create the directory if it doesn't exist
echo "Creating directory on server..."
ssh makin@homestuck.net 'mkdir -p /var/www/homestuck-online'

# Move the built application to the server
echo "Moving built application to server..."
scp -r dist/* makin@homestuck.net:/var/www/homestuck-online

echo "Deployment complete."
