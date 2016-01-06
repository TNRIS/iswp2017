LIBRARY_FILES = \
	node_modules/d3/src/start.js \
	node_modules/d3/src/scale/linear.js \
	node_modules/d3/src/layout/treemap.js \
	node_modules/d3/src/selection/index.js \
	node_modules/d3/src/end.js

.PHONY: clean

all: clean copy-output

clean:
	rm d3.custom.js

copy-output: d3.custom.js
	cp d3.custom.js ../app/public/src/vendor/js/d3.custom.js

d3.custom.js: $(LIBRARY_FILES)
	node_modules/.bin/smash $(LIBRARY_FILES) | node_modules/.bin/uglifyjs - -c -m -o $@
	cat d3_license.js $@ > tmp_out
	mv tmp_out $@
