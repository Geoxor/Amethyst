# Maintainer: Georgios Tsotsos <geoxor123@outlook.com>
pkgname=amethyst
pkgver=1.8.15
pkgrel=0
pkgdesc="Audio Player"
arch=('x86_64')
url="https://github.com/Geoxor/$pkgname"
license=('MIT')
makedepends=('gcc-multilib' 'git' 'gendesk' 'yarn' 'libxcrypt-compat')
source=("git+https://github.com/Geoxor/$pkgname/#tag=v$pkgver")
md5sums=('SKIP')

prepare(){
	cd "$pkgname"
	gendesk -n -f --pkgname "$pkgname" --pkgdesc "$pkgdesc" --exec="/opt/$pkgname/${pkgname}"
	yarn
}

build() {
	cd "$pkgname"
	yarn build && yarn electron-builder --linux dir --publish never
}

package() {
	cd "$pkgname"
	install -Dm644 "$pkgname.desktop" "$pkgdir/usr/share/applications/$pkgname.desktop"
	install -d "$pkgdir/opt/$pkgname" && cp -r release/build/linux-unpacked/* "$pkgdir/opt/$pkgname"
	install -Dm644 assets/icon.svg "$pkgdir/usr/share/pixmaps/$pkgname.svg"
	install -Dm644 LICENSE -t "$pkgdir/usr/share/licenses/$pkgname"
}