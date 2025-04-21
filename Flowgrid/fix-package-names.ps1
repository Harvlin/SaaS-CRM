$files = Get-ChildItem -Path . -Recurse -Filter "*.java"

foreach ($file in $files) {
    Write-Host "Processing $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Fix package declarations
    $content = $content -replace 'package com\.project\.flowgrid', 'package com.project.Flowgrid'
    
    # Fix import statements
    $content = $content -replace 'import com\.project\.flowgrid', 'import com.project.Flowgrid'
    
    # Save the modified content back to the file
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Package name standardization complete" 