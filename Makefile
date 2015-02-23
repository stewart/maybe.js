SOURCES = maybe.js
MINIFIED = ${SOURCES:.js=.min.js}
VERSION = $(shell node -e "console.log(require('./package.json').version)")
PREAMBLE = "/*! maybe.js v$(VERSION) | (c) 2015 Andrew Stewart | MIT license */"

%.min.js: %.js
	@echo "Minifying $< => $@"
	@uglifyjs --compress --mangle --preamble $(PREAMBLE) -- $< 2>/dev/null > $@

all: $(MINIFIED)

lint:
	@jshint maybe.js
