#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys

if len(sys.argv) <= 3:
    print("Param length error!!!")
    quit()

infilename = sys.argv[1]
source_str = sys.argv[2]
target_str = sys.argv[3]

infile = open(infilename, "r")
outfile = open("./__temp__.ts", "w")

newline = ""
for line in infile:
    newline = line.replace(source_str, target_str)
    outfile.writelines(newline)

infile.close()
outfile.close()
os.remove(infilename)
os.rename("./__temp__.ts", infilename)