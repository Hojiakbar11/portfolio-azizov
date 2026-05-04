# Renaming the folder to [slug]
Move-Item -LiteralPath "src/app/projects/[id]" -Destination "src/app/projects/[slug]" -Force -ErrorAction SilentlyContinue
