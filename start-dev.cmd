@echo off
cd /d "%~dp0"
"C:\Users\LAURA\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "%~dp0node_modules\next\dist\bin\next" dev > "%~dp0next-dev.log" 2> "%~dp0next-dev.err.log"
