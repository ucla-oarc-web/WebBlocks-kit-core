# # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Utility class that calls forward to WebBlocks rake

require 'pathname'

class WebBlocks
  
  attr_accessor :path
  attr_accessor :local
  
  def initialize(path)
    @path = path
    @local = Local.new Pathname.new(__FILE__).parent, Pathname.new(__FILE__).parent.parent
  end
  
  def rake(command = '')
    Dir.chdir @path do 
        sh "rake #{command} -- --config=#{Pathname.new(__FILE__).parent}/Rakefile-config.rb"
    end
  end
  
  class Local
    def initialize src_dir, build_dir
      @src_dir = src_dir
      @build_dir = build_dir
    end
    def log_task name
      log "Executing task: #{name}"
    end
    def log message
      puts "[Local] #{message}"
    end
    def move from, to
      FileUtils.mkdir_p File.dirname "#{@build_dir}/#{to}"
      FileUtils.copy "#{@src_dir}/#{from}", "#{@build_dir}/#{to}"
    end
    def move_sub from, to
      Dir.foreach("#{@src_dir}/#{from}") do |item|
        next if item == '.' or item == '..'
        FileUtils.mkdir_p "#{@build_dir}/#{to}"
        FileUtils.copy "#{@src_dir}/#{from}/#{item}", "#{@build_dir}/#{to}"
      end
    end
    def remove path
      FileUtils.rm_rf "#{@build_dir}/#{path}"
    end
    def build_fonts
      log "Executing task: build_fonts"
      move_sub "font", "font"
    end
    def build_all
      build_fonts
    end
    def clean
      clean_fonts
    end
    def clean_fonts
      log "Executing task: clean_fonts"
      remove "font"
    end
  end
  
end

# # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Set path to WebBlocks

webblocks_path = Pathname.new(__FILE__).realpath.parent + "_blocks"
blocks = WebBlocks.new webblocks_path

# # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Define the valid Rake tasks that will be call-forwarded

include Rake::DSL
task :default => [:_init] do
  blocks.rake
end
task :init => [:_init] do
  blocks.rake 'init'
end
task :build => [:_init] do
  blocks.rake 'build'
end
task :build_all => [:_init] do
  blocks.rake 'build_all'
  blocks.local.build_all
end
task :build_css => [:_init] do
  blocks.rake 'build_css'
end
task :build_fonts => [:_init] do
  blocks.local.build_fonts
end
task :build_img => [:_init] do
  blocks.rake 'build_img'
end
task :build_js => [:_init] do
  blocks.rake 'build_js'
end
task :clean => [:_init] do
  blocks.rake 'clean'
  blocks.local.clean
end
task :clean_packages => [:_init] do
  blocks.rake 'clean_packages'
end
task :clean_all => [:_init] do
  blocks.rake 'clean_all'
  blocks.local.clean_fonts
end
task :reset_packages => [:_init] do
  blocks.rake 'reset_packages'
end
task :reset => [:_init] do
  blocks.rake 'reset'
end

# # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Specialized task that pre-initializes

task :_init do
  IO.popen "git rev-parse --show-toplevel" do |io|
    Dir.chdir io.gets.strip do
      sh "git submodule init"
      sh "git submodule update"
    end
  end
  Dir.chdir webblocks_path do
    sh "bundle"
    sh "npm install"
  end
end