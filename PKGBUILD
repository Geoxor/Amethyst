Maintainer: Georgios Tsotsos <geoxor123@outlook.com>
pkgname=amethyst
pkgver=1.7.10
pkgrel=1
pkgdesc="Amethyst is an Electron-based audio player with a node-based audio routing system, the main goal of this project is to make a music player in Typescript that has pro-level features as most DAWs / DAEs, while also providing useful tools and customizability to the end-user to deal with audio."
arch=('x86_64')
url="https://github.com/Geoxor/amethyst"
license=('MIT')
depends=('libvips')
makedepends=('gcc-multilib' 'g++-multilib' 'libvips' 'git')
options=()
install=
changelog=
source=("$pkgname-$pkgver.tar.gz"
        "$pkgname-$pkgver.patch")
source=('amethyst::git://github.com/Geoxor/amethyst.git')
md5sums=('SKIP') #generate with 'makepkg -g'

build() {
	cd "$pkgname-$pkgver"
	./configure --prefix=/usr
	make
}

check() {
	cd "$pkgname"
  npm i yarn -g
  yarn test
}

package() {
	cd "$pkgname"
  yarn package
}