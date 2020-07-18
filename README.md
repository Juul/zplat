
Uses the [zpl-image](https://www.npmjs.com/package/zpl-image) library to convert a PNG image to a ZPL that can be sent directly to any ZPL-supporting Zebra label printer.

# Setup

```
npm install
```

# Usage

```
./bin/cmd.js myfile.png > /dev/usb/lp0
```

Ensure you have write access to the USB device.

# Copyright and license

Copyright 2020 [Renegade Bio](https://renegade.bio)

License: AGPLv3 (see `LICENSE` file in this repo)