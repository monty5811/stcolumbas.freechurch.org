#!/bin/bash
set -euxo pipefail

{
    QUICK_BUILD=1 time make build
} ||
    {
        time make build
    }
