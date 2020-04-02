#!/usr/bin/env python3

#################################################
# Author: Muuo Wambua                           #
# Note: This has only been tested with Python 3 #
# License: MIT                                  #
#################################################
##################################################################################
# Copyright (c) 2018 Muuo Wambua                                                 #
#                                                                                #
# Permission is hereby granted, free of charge, to any person obtaining a copy   #
# of this software and associated documentation files (the "Software"), to deal  #
# in the Software without restriction, including without limitation the rights   #
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell      #
# copies of the Software, and to permit persons to whom the Software is          #
# furnished to do so, subject to the following conditions:                       #
#                                                                                #
# The above copyright notice and this permission notice shall be included in all #
# copies or substantial portions of the Software.                                #
#                                                                                #
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR     #
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,       #
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE    #
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER         #
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  #
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  #
# SOFTWARE.                                                                      #
################################################################################## 

import argparse, sys
import urllib.request
import json

def main(queries, outFile, host, port, N):
    for (qNum, query) in enumerate(queries):
        query = query.replace(" ", "+")
        outFile.write(
            "# Q%d - %s\n" % (
                qNum+1, query
            )
        )
        response = urllib.request.urlopen(
            "http://%s:%d/solr/nutch/select?wt=json&%sq=%s&fl=title,url,score,[features%%20efi.query=%s%%20store=_DEFAULT_]" % (
                host, 
                port,
                "rows=%d&" % N if N>0 else "",
                query,
                query
            )
        )
        if response.getcode() != 200:
            raise Exception("Request Failed!\nCode %d: %s" % (
                response.getcode(),
                response.read()
            ))

        solrResp = json.loads(
            response.read()
        )
        
        relevance = len(solrResp["response"]["docs"])
        for doc in solrResp["response"]["docs"]:
            features = sorted([f.split("=") for f in doc["[features]"].split(",")])
            features = ["%d:%s" % (i+1, v) for (i, (f, v)) in enumerate(features)]
            outFile.write("%d %s # %s\n" % (
                relevance,
                " ".join(features),
                doc["url"]
            ))
            relevance -= 1
    outFile.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Create a raw data file for ranking.')
    parser.add_argument('-n', '--number_of_rows', type=int, default=-1)
    parser.add_argument('-q', '--queries', nargs='*', type=str)
    parser.add_argument('-o', '--outFile', nargs='?', type=argparse.FileType('w+'), default=sys.stdout)
    parser.add_argument('-i', '--inFile', type=argparse.FileType('r'))
    parser.add_argument('-H', '--host', type=str, default="localhost")
    parser.add_argument('-P', '--port', type=int, default=8983)

    args = parser.parse_args()

    queries = args.queries or []
    if args.inFile:
        additions = [
            line.strip() for line in args.inFile if line.strip()
        ]
        queries.extend(additions)
    if len(queries) == 0:
        print("Please provide 1 or more queries via --queries or --inFile", file=sys.stderr)
        exit(1)

    main(queries, args.outFile, args.host, args.port, args.number_of_rows)
