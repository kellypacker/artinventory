## Art Inventory System

Application to manage artworks.

Based on the [Node Express Mongoose boilerplate application](https://github.com/madhums/node-express-mongoose/)

## Usage

Clone this repository

    $ npm install
    $ npm start

## Development

    $ mongod
    $ npm start

## Notes on where I left off 4/14/14:
### Imagemagick
Hadn't been able to work on it in 2 month. In that time I had updated my system to mavericks. When I later came back to work on the app, it was giving cryptic messages when trying to upload images. I finally figured out that imageMagick has stopped working after I had upgraded to mavericks. Previously I had installed imagemagick from source and installed it with homebrew. I removed all installations of imagemagick, also uninstalled libtool. So I uninstalled libtool, imagemagick with homebrew and reinstalled.

```
brew uninstall libtool
brew uninstall imagemagick jpeg libtiff
brew install libtool
//actually didn't have to do this in the end, but keep it for reference
//brew install imagemagick --with-fontconfig --with-ghostscript --with-libtiff --with-webp
brew install imagemagick
```
I reinstalled imagemagick with specific modules. Imagemagick is currently working on my local system, resizing images and then pushing them to s3.

To check if imagemagick is working:

```
convert --version
convert test: test.png
identify test.png
identify -list format
```

If further issues with imagemagick, try this: http://cactuslab.com/imagemagick/

## To-dos
* Ability to upload multiple images (thumb, snapshots)
* Implement tags
* Reimplement users
* Create series feed
* Create artwork feed


## License

MIT
