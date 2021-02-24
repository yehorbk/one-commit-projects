:: masm32 manager
:: developed by Yehor Bublyk
@echo off

set command="%1"
set project=%2

if %command% == "" call :error
if %command% == "clean" call :clean
if %command% == "compile" call :compile
if %command% == "link" call :link
if %command% == "build" call :build
if %command% == "run" call :run
goto end

:error
echo Specified unknown command: %command%
echo Please use: clean, compile, link, build or run

:clean
if exist %project%.obj del %project%.obj
if exist %project%.exe del %project%.exe
exit /b

:compile
\masm32\bin\ml /c /coff %project%.asm
exit /b

:link
\masm32\bin\link /subsystem:windows %project%.obj
exit /b

:build
call :clean
call :compile
call :link
exit /b

:run
call :build
%project%.exe
exit /b

:end
set command=
set project=
