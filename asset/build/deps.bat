@echo off
python ../closure-library/closure/bin/build/depswriter.py --root_with_prefix="../common/js ../../../common/js" > ../common/js/deps.js
IF %ERRORLEVEL% == 0 (
	echo Written successfully in deps.js!
) ELSE (
	echo ERROR: %ERRORLEVEL% 
)
PAUSE > nul