# generate the new manifest

# get the current version with node
$version = node -p "require('./package.json').version"

wingetcreate update Geoxor.Amethyst `
  -u "https://github.com/Geoxor/Amethyst/releases/download/v$($version)/Amethyst-Setup-$($version).exe|x64"`
  -v $version `
  --release-notes-url "https://github.com/Geoxor/Amethyst/releases/tag/v$($version)" `
  -o .\manifests
