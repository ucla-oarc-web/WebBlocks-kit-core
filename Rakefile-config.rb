require 'pathname'
rootdir = File.dirname(Pathname.new(__FILE__).realpath)

# The directory into which WebBlocks is built
WebBlocks.config[:build][:dir] = "#{rootdir}/../"

# The directory where sources for the build are located
WebBlocks.config[:src][:dir] = "#{rootdir}"

# Location of WebBlocks core components (config.rb, definitions, core adapter)
WebBlocks.config[:src][:core][:dir] = "#{rootdir}/_blocks/src/core"

# Location of WebBlocks adapters
WebBlocks.config[:src][:adapters][:dir] = "#{rootdir}/_blocks/src/adapter"