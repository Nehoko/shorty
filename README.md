# Shorty: URL shortener written in Deno

## Description

The app is pretty straight forward: provide the url and it'll return the short
version of it.

## Requirements

- Deno v2.x

## Installation

1. Install required dependencies:

```shell
deno install
```

2. Provide environment variables (optional)

| Name                           | Default Value | Description                                        |
| ------------------------------ | ------------- | -------------------------------------------------- |
| SHORT_URL_MAX_LENGTH           | 7             | Max length of final URL domain exluded             |
| SHORT_URL_MAX_LIFETIME_IN_DAYS | 365           | Max lifetime of final URL (refresh after each use) |
| MAX_RETRIES                    | 5             | Max retries of mutation requests (all but read)    |

## Run Prod

```shell
deno task start
```

## Run Dev

```shell
deno task dev
```
