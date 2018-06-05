task :default => [:test]

desc 'Clean up generated site'
task :clean do
  sh 'rm -rf public .jekyll-cache .sass-cache'
end

desc 'Generate site'
task :build => :clean do
  require 'jekyll'
  Jekyll::Site.new(Jekyll.configuration({
    'config' => '_config.yml'
  })).process
end

desc 'Validate generated site'
task :test => :build do
  require 'html-proofer'
  HTMLProofer.check_directory('public', {
    :url_swap => { '*.groveld.com/' => '/' },
    :only_4xx => true,
    :check_favicon => true,
    :check_html => false,
    :assume_extension => true,
    :allow_hash_href => true,
    :disable_external => true
  }).run
end
