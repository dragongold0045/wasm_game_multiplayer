@echo off
setlocal enabledelayedexpansion

:: Setup ANSI color codes (Windows 10/11)
set "ESC="
set "Green=!ESC![92m"
set "Yellow=!ESC![93m"
set "Cyan=!ESC![96m"
set "Red=!ESC![91m"
set "Gray=!ESC![90m"
set "Reset=!ESC![0m"

:: 1. Initialization
title [0%%] Initializing... - WASM Builder
echo %Cyan%==================================================%Reset%
echo  %Cyan%[WASM BUILDER]%Reset% Starting compilation process...
echo %Cyan%==================================================%Reset%

:: 2. Scanning .cpp files with Stats
title [10%%] Scanning source files... - WASM Builder
echo %Yellow%[1/3]%Reset% Scanning and analyzing .cpp source files...

set "FILES="
set /a count=0
set /a total_lines=0

for /R %%i in (*.cpp) do (
    set "FILES=!FILES! "%%i""
    set /a count+=1
    
    :: Get file size in bytes and convert to KB (approximate)
    set /a size_bytes=%%~zi
    set /a size_kb=!size_bytes! / 1024
    if !size_kb!==0 set "size_str=!size_bytes! B"
    if NOT !size_kb!==0 set "size_str=!size_kb! KB"

    :: Count lines of code in file
    set /a lines=0
    for /f %%l in ('find /c /v "" ^< "%%i"') do set /a lines=%%l
    set /a total_lines+=!lines!

    :: Print file details
    echo   %Gray%- Found:%Reset% %%~nxi %Cyan%[!size_str! ^| !lines! lines]%Reset%
)

if %count%==0 (
    title [Error] No source files found! - WASM Builder
    echo %Red%[ERROR] Could not find any .cpp files in this directory!%Reset%
    goto END
)

echo %Green%--- Scan complete. Found %count% file(s) [Total: %total_lines% lines of code].%Reset%
echo.

:: 3. Configuring Emscripten flags
title [30%%] Configuring flags... - WASM Builder
echo %Yellow%[2/3]%Reset% Configuring Emscripten (EM++) build options...
set "CMD=emcc !FILES! -O3 -sMODULARIZE -sWASM -sEXPORTED_RUNTIME_METHODS="['allocateUTF8', 'HEAP8', 'HEAPU8', 'HEAPU32', 'HEAPF32', 'HEAPU64', 'HEAPF64', 'ccall', 'cwrap', 'stringToUTF8', 'UTF8ToString', 'lengthBytesUTF8']" -sEXPORTED_FUNCTIONS="['_free']" -sEXPORT_ES6 --bind -o client.js"

echo %Gray%--------------------------------------------------%Reset%
echo %Gray%[EXEC]: !CMD!%Reset%
echo %Gray%--------------------------------------------------%Reset%
echo.

:: 4. Compiling WebAssembly
title [50%%] Compiling WebAssembly... - WASM Builder
echo %Yellow%[3/3]%Reset% %Cyan%Running EM++ compiler to generate client.js + client.wasm...%Reset%
echo %Gray%(This may take a few seconds, please wait...)%Reset%

:: Execute the command
%CMD%

:: Check execution result
if %ERRORLEVEL% NEQ 0 (
    title [FAILED] Build Error! - WASM Builder
    echo.
    echo %Red%==================================================%Reset%
    echo  %Red%[ERROR]%Reset% Compilation failed! See errors above.
    echo %Red%==================================================%Reset%
    goto END
)

:: 5. Success State
title [100%%] Build Success! - WASM Builder
echo.
echo %Green%==================================================%Reset%
echo  %Green%[SUCCESS] WEB ASSEMBLY COMPILED SUCCESSFULLY!%Reset%
echo  %Green%-> Generated: client.js and client.wasm%Reset%
echo %Green%==================================================%Reset%

:END
echo.
echo %Gray%Press any key to exit...%Reset%
pause > nul