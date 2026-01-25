require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'PeekPreviewModule'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.swift_version  = '5.9'
  repo = package['repository']
  repo_url = repo.is_a?(String) ? repo : repo['url']
  s.source         = repo_url ? { git: repo_url, tag: "v#{s.version}" } : { path: '.' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'RNScreens'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = [
    'PeekPreviewModule.swift',
    'PeekPreviewModuleView.swift'
  ]
end
