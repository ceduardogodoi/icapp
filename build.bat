@echo off

echo Apagando apks antigas da Area de Trabalho...
del /Q %USERPROFILE%\Desktop\*.apk

cd android
echo Inciando compilacao do projeto...
call gradlew assembleRelease

echo Copiando apk para a Area de Trabalho...
copy /Y app\build\outputs\apk\release\app-release.apk %USERPROFILE%\Desktop

cd ..
