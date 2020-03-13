#! /usr/bin/env python
# -*- coding: utf-8 -*-

path = "./dist/img/"

import os

files = os.listdir(path)
for filename in files:
    split_filename = os.path.splitext(filename)
    if split_filename[1] != ".json":
        continue
    outfilename = split_filename[0] + ".js"
    with open(os.path.join(path, filename), "r") as infile, open(os.path.join(path, outfilename), "w") as outfile:
        outfile.write("var data = ")
        for line in infile:
            outfile.writelines(line)
        outfile.writelines("\ndefine([], function () {\n    return data;\n});")

    print("%s -> %s" % (filename, outfilename))

quit()