task :default => [:ghpages, :test]

desc 'Clean up workspace before build'
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
task :test do
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

desc 'Prepare site for GitHub Pages'
task :ghpages => :build do
  sh 'find public/assets -type f -name ".sprockets-manifest-*.json" -delete'
  sh 'echo "www.groveld.com" > public/CNAME'
end
