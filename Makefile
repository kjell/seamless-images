start:
	beefy index.js:bundle.js --live --open

images:
	for id in $$(grep 'var image_ids' index.js | sed 's/var image_ids = //; s/"//g'); do \
		[[ -f $$id.jpg ]] || curl -o $$id.jpg http://api.artsmia.org/images/$$id/medium.jpg; \
	done
