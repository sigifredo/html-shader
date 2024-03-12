

watch:
	sass --watch --sourcemap=none --style=compressed scss/styles.scss:css/styles.css

build:
	sass --sourcemap=none --style=expanded scss/styles.scss:css/styles.css

compressed:
	sass --sourcemap=none --style=compressed scss/styles.scss:css/styles.css
