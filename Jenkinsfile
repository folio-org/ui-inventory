@Library ('folio_jenkins_shared_libs@folio-1940-node-10') _

buildNPM {
  publishModDescriptor = 'yes'
  runLint = 'yes'
  runSonarqube = true
  runRegression = 'none'
  runTest = 'yes'
  runTestOptions = '--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'
}


