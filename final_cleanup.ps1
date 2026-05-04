# Stop any node processes that might be locking files
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# Delete conflicting folders using literal paths to handle [ and ]
Remove-Item -LiteralPath "src/app/projects/[slug]" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath "src/app/projects/[...slug]" -Recurse -Force -ErrorAction SilentlyContinue

# Ensure [id] is the only dynamic route left
Get-ChildItem -Path "src/app/projects"
