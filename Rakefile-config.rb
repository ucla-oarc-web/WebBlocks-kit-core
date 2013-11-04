require 'pathname'
rootdir = File.dirname(Pathname.new(__FILE__).realpath)

# True to compile in debug mode (no minification)
WebBlocks.config[:build][:debug] = true

# The directory into which WebBlocks is built
WebBlocks.config[:build][:dir] = "#{rootdir}/../"

# The directory where sources for the build are located
WebBlocks.config[:src][:dir] = "#{rootdir}"

# Location of WebBlocks core components (config.rb, definitions, core adapter)
WebBlocks.config[:src][:core][:dir] = "#{rootdir}/_blocks/src/core"

# Location of WebBlocks adapters
WebBlocks.config[:src][:adapters][:dir] = "#{rootdir}/_blocks/src/adapter"

# Location of WebBlocks adapters
WebBlocks.config[:src][:extension][:dir] = "#{rootdir}/extension"

WebBlocks.config[:src][:extensions] << "blocks"
WebBlocks.config[:src][:extensions] << "ucla"
WebBlocks.config[:src][:extensions] << "ariaMapper"

# Do not use an adapter
WebBlocks.config[:src][:adapter] = false

# Uncomment this line if site is already built with Bootstrap:
#WebBlocks.config[:src][:adapter] = 'bootstrap'