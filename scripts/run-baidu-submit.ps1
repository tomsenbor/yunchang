param(
    [ValidateSet("one", "core", "all", "file")]
    [string]$Mode = "one",

    [string]$FilePath
)

$ErrorActionPreference = "Stop"

$Project = Split-Path -Parent $PSScriptRoot
$NodeScript = Join-Path $PSScriptRoot "submit-baidu.mjs"
$NodeExitCode = 1
$EndpointPtr = [IntPtr]::Zero
$NodeArguments = @("--$Mode")

Set-Location -LiteralPath $Project

if (-not (Test-Path -LiteralPath $NodeScript -PathType Leaf)) {
    throw "没有找到 submit-baidu.mjs"
}

if ($Mode -eq "file") {
    if ([string]::IsNullOrWhiteSpace($FilePath)) {
        throw "Mode=file 时必须提供 -FilePath。"
    }

    $ResolvedFile = (Resolve-Path -LiteralPath $FilePath -ErrorAction Stop).Path
    if (-not (Test-Path -LiteralPath $ResolvedFile -PathType Leaf)) {
        throw "URL 文件不存在。"
    }

    $NormalizedProject = [System.IO.Path]::GetFullPath($Project).TrimEnd("\")
    $NormalizedFile = [System.IO.Path]::GetFullPath($ResolvedFile)
    $ProjectPrefix = "$NormalizedProject\"

    if (-not $NormalizedFile.StartsWith(
        $ProjectPrefix,
        [System.StringComparison]::OrdinalIgnoreCase
    )) {
        throw "FilePath 必须位于当前项目目录内。"
    }

    $NodeArguments = @("--file", $NormalizedFile)
}
elseif (-not [string]::IsNullOrWhiteSpace($FilePath)) {
    throw "只有 Mode=file 时允许使用 -FilePath。"
}

$SecureEndpoint = Read-Host `
    "请粘贴百度当前 aixiaolvtools.com 页面显示的完整 API 地址" `
    -AsSecureString

$EndpointPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR(
    $SecureEndpoint
)

try {
    $Endpoint = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
        $EndpointPtr
    )

    if ([string]::IsNullOrWhiteSpace($Endpoint)) {
        throw "没有输入百度 API 地址"
    }

    $env:BAIDU_PUSH_ENDPOINT = $Endpoint.Trim()

    Write-Host "百度接口已安全载入。" -ForegroundColor Green
    Write-Host "准备执行模式：$Mode" -ForegroundColor Cyan

    & node $NodeScript @NodeArguments
    $NodeExitCode = $LASTEXITCODE
}
finally {
    Remove-Item Env:BAIDU_PUSH_ENDPOINT -ErrorAction SilentlyContinue

    if ($EndpointPtr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($EndpointPtr)
    }

    Remove-Variable `
        SecureEndpoint, Endpoint, EndpointPtr, NodeArguments, ResolvedFile, NormalizedFile `
        -ErrorAction SilentlyContinue
}

exit $NodeExitCode