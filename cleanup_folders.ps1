Remove-Item -Path "src/app/projects/[id]" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/projects/[...slug]" -Recurse -Force -ErrorAction SilentlyContinue
