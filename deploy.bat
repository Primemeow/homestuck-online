@echo off
SETLOCAL

REM Run the build command
echo Building application...
call yarn build

REM Move the built application to the server
echo Moving built application to server...
rmdir /s /q dist\collection
scp -r dist/* makin@homestuck.net:/var/www/homestuck-online 

echo Deployment complete.
ENDLOCAL