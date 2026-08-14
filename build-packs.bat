@echo off

echo Building Character Pack...
fvtt package pack --id hm3 --type System -n character -t Item --in packs\character\_source --out packs

echo Building Possessions Pack...
fvtt package pack --id hm3 --type System -n possessions -t Item --in packs\possessions\_source --out packs

echo Building Esoteric Pack...
fvtt package pack --id hm3 --type System -n esoteric -t Item --in packs\esoteric\_source --out packs

echo Building System Help Pack...
fvtt package pack --id hm3 --type System -n system-help -t JournalEntry --in packs\system-help\_source --out packs

echo Done.
pause