<# Windows PowerShell script to start all three agent workers with per-agent .env files loaded #>
<# Loads env vars from agent1/.env, agent2/.env, agent3/.env and launches uvicorn for each #>
$base = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Load-EnvFile([string]$path) {
  if (Test-Path $path) {
    Get-Content $path | ForEach-Object {
      if ($_ -match '^[#]|^$') { return }
      if ($_ -match '^\s*([^=]+)\s*=\s*(.*)$') {
        $name = $matches[1].Trim()
        $val  = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $val, [EnvironmentVariableTarget]::Process)
      }
    }
  }
}

# Agent 1
$envPath1 = "$base\..\agent-workers\agent1\.env"
Load-EnvFile $envPath1
Start-Process -FilePath python -ArgumentList '-m','uvicorn','main:app','--reload','--port','8001','--host','0.0.0.0' -WorkingDirectory "$base\..\agent-workers\agent1" -NoNewWindow

# Agent 2
$envPath2 = "$base\..\agent-workers\agent2\.env"
Load-EnvFile $envPath2
Start-Process -FilePath python -ArgumentList '-m','uvicorn','main:app','--reload','--port','8002','--host','0.0.0.0' -WorkingDirectory "$base\..\agent-workers\agent2" -NoNewWindow

# Agent 3
$envPath3 = "$base\..\agent-workers\agent3\.env"
Load-EnvFile $envPath3
Start-Process -FilePath python -ArgumentList '-m','uvicorn','main:app','--reload','--port','8003','--host','0.0.0.0' -WorkingDirectory "$base\..\agent-workers\agent3" -NoNewWindow

Write-Output 'All agents started (Windows).'
