#!/usr/bin/env python3
from bs4 import BeautifulSoup
import os, subprocess

def main():
    root = os.path.join(os.path.dirname(__file__), "..", "dist")
    index = os.path.join(root, "index.html")
    fp = open(index)
    html = fp.read()
    fp.close()
    soup = BeautifulSoup(html, "lxml")
    svg = os.path.join(os.path.dirname(__file__), "Riddling.svg")

    favicons = soup.select("link[rel=icon]")
    appleicons = soup.select("link[rel=apple-touch-icon]")

    for icon in favicons + appleicons:
        fn = os.path.join(root, icon["href"])
        fol = os.path.dirname(fn)
        try:
            os.makedirs(fol)
        except OSError as e:
            if e.errno == 17:
                pass
            else:
                raise

        size = int(os.path.splitext(fn)[0].split("-")[-1])

        newsize = "%sx%s" % (size, size)
        cmd = ["convert", svg, "-resize", newsize, fn]
        print("Creating %sx%s icon as %s" % (size, size, fn))
        subprocess.call(cmd)

if __name__ == "__main__":
    main()