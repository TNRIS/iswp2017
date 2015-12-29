.PHONY: delete-cache download-cache download-webfont update-cache

S3_CACHE_URL=s3://tnris-misc/iswp/2017/cache.db
LOCAL_CACHE_FILE=./app/db/cache.db

S3_WEBFONT_URL=s3://tnris-misc/iswp/2017/gill-sans.zip
LOCAL_WEBFONT_CSS=app/public/static/webfonts/gill-sans.css

TMP_DIR=./.tmp

all: download-cache download-webfont

download-cache: ${LOCAL_CACHE_FILE}

# download cache.db from to S3; requires aws-cli to be set up proper
${LOCAL_CACHE_FILE}:
	mkdir -p $(dir ${LOCAL_CACHE_FILE})
	aws s3 cp ${S3_CACHE_URL} $@


update-cache: delete-cache download-cache

delete-cache:
	rm ${LOCAL_CACHE_FILE}


download-webfont: ${LOCAL_WEBFONT_CSS}

${TMP_DIR}/$(notdir ${S3_WEBFONT_URL}):
	aws s3 cp ${S3_WEBFONT_URL} $@

${LOCAL_WEBFONT_CSS}: ${TMP_DIR}/$(notdir ${S3_WEBFONT_URL})
	unzip $< -d $(dir $@)
	touch $@

clean:
	rm ${TMP_DIR}
