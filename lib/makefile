
output_file = Big.js

date = $(shell date '+%F \(%A, %d %B %Y\)')
version = $(shell cat ./version.txt)

header:
	@ echo "Building header..."
	@ cat big.header.js | sed 's/__date__/$(date)/' | sed 's/__version__/$(version)/' > full_header.js
	
big: header
	@ echo "Building Big..."
	@ cat full_header.js > $(output_file)
	@ cat big.define.js >> $(output_file)
	@ cat big.open_closure.js >> $(output_file)
	@ cat big.global.js >> $(output_file)
	@ cat big.prototype.js >> $(output_file)
	@ cat big.core.js >> $(output_file)
	@ cat big.add.js >> $(output_file)
	@ cat big.subtract.js >> $(output_file)
	@ cat big.multiply.js >> $(output_file)
	@ cat big.divide.js >> $(output_file)
	@ cat big.close_closure.js >> $(output_file)
	
big_no_closure: header
	@ echo "Building Big..."
	@ cat full_header.js > $(output_file)
	@ cat big.define.js >> $(output_file)
	@ cat big.global.js >> $(output_file)
	@ cat big.prototype.js >> $(output_file)
	@ cat big.core.js >> $(output_file)
	@ cat big.add.js >> $(output_file)
	@ cat big.subtract.js >> $(output_file)
	@ cat big.multiply.js >> $(output_file)
	@ cat big.divide.js >> $(output_file)

all: big
