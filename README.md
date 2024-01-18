# Experiment Ably CLI

An unofficial experimental Ably CLI.  Is goal is to replicate as much of the functionality of the Ably Dashboard as possible in a CLI.

This project is an unofficial tool and has no affiliation with Ably Realtime.

## Installation

npm i -g ablycli

## Usage

### Tail Application Events

`ablycli tail <appid>`
`ablycli tail -s application <appid>`

- connection.opened
- connection.closed
- transport.opened
- transport.closed
- channel.region.active
- channel.region.inactive

### Tail Channel Events

`ablycli tail -s channels -c [channelname] <appid>`

- message

### Statistics

`ablycli stats <appid>`

### Publish

