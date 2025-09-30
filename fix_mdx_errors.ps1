# PowerShell script to fix common MDX compilation errors

Write-Host "Fixing MDX compilation errors in docs..."

# Get all markdown files
$mdFiles = Get-ChildItem -Path "apps/docs" -Recurse -Filter "*.md"

foreach ($file in $mdFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix common MDX issues
    
    # 1. Replace <number with &lt;number (but not in code blocks)
    $content = $content -replace '<(\d+)', '&lt;$1'
    
    # 2. Replace >number with &gt;number (but not in code blocks)
    $content = $content -replace '>(\d+)', '&gt;$1'
    
    # 3. Fix malformed self-closing tags like <br/c> to <br />
    $content = $content -replace '<br/c>', '<br />'
    
    # 4. Fix JSX attribute names starting with numbers
    $content = $content -replace '(\w+)="(\d+)', '$1="$2'
    
    # 5. Fix malformed JSX expressions
    $content = $content -replace '\{(\d+)\}', '{$1}'
    
    # 6. Fix broken image references by adding pathname:// protocol
    $content = $content -replace '!\[([^\]]*)\]\(assets/images/([^)]+)\)', '![$1](pathname://assets/images/$2)'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "MDX error fixes completed!"
