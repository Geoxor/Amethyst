import fs from "fs";
import {version, description, license, author, name} from "../package.json";
import chalk from "chalk";

try {
  fs.statSync("./manifests/aur/");
  
} catch (error) {
  fs.mkdirSync("./manifests/aur/", {recursive: true});
}

fs.writeFileSync("./manifests/aur/.SRCINFO", `
pkgbase = amethyst-player
pkgdesc = ${description}
pkgver = ${version}
pkgrel = 1
url = https://github.com/Geoxor/amethyst
arch = x86_64
license = ${license}
makedepends = gcc-multilib
makedepends = git
makedepends = gendesk
makedepends = yarn
makedepends = libxcrypt-compat
source = git+https://github.com/Geoxor/amethyst/#tag=v${version}
md5sums = SKIP

pkgname = amethyst-player
`);

console.log(chalk.bgCyan("[AUR Manifest]"), chalk.cyan("Generated .SRCINFO"));

fs.writeFileSync("./manifests/aur/PKGBUILD", `
# Maintainer: ${author}
appname=${name}
pkgname=$appname-player
pkgver=${version}
pkgrel=1
pkgdesc="${description}"
arch=('x86_64')
url="https://github.com/Geoxor/$appname"
license=('MIT')
makedepends=('gcc-multilib' 'git' 'gendesk' 'yarn' 'libxcrypt-compat')
source=("git+https://github.com/Geoxor/$appname/#tag=v$pkgver")
md5sums=('SKIP')

logo() {
	echo "    ___                   __  __               __ "
	echo "   /   |  ____ ___  ___  / /_/ /_  __  _______/ /_"
	echo "  / /| | / __ \\\`__ \\\\/ _ \\\\/ __/ __ \\\\/ / / / ___/ __/"
	echo " / ___ |/ / / / / /  __/ /_/ / / / /_/ (__  ) /_  "
	echo "/_/  |_/_/ /_/ /_/\\\\___/\\\\__/_/ /_/\\\\__, /____/\\\\__/  "
	echo "                                /____/"
}

prepare(){
	logo
	cd "$appname"
	gendesk -n -f --pkgname "$appname" --pkgdesc "$pkgdesc" --exec="/opt/$appname/$appname"
	git submodule update --init --recursive
	yarn
}

build() {
	cd "$appname"
	yarn build && yarn electron-builder --linux dir --publish never
}

package() {
	cd "$appname"
	install -Dm644 "$appname.desktop" "$pkgdir/usr/share/applications/$appname.desktop"
	install -d "$pkgdir/opt/$appname" && cp -r release/build/linux-unpacked/* "$pkgdir/opt/$appname"
	install -Dm644 assets/icon.svg "$pkgdir/usr/share/pixmaps/$appname.svg"
	install -Dm644 LICENSE -t "$pkgdir/usr/share/licenses/$appname"
}
`);

console.log(chalk.bgCyan("[AUR Manifest]"), chalk.cyan("Generated .PKGBUILD"));
