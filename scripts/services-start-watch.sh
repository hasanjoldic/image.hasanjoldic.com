#!/bin/bash

NODE_ENV=development lerna run --scope=@images.hasanjoldic.com/{backend,frontend} --stream start:watch