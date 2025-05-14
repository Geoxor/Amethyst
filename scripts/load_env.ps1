Get-Content .env | ForEach-Object {
    $key, $value = $_ -split "="
    [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
}
