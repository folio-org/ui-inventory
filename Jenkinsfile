@Library ('folio_jenkins_shared_libs@python3-compatability') _

buildNPM {
  publishModDescriptor = true
  runLint = true
  runSonarqube = true
  runRegression = 'none'
  runTest = true
  runTestOptions = '--karma.singleRun --karma.browsers ChromeDocker --karma.reporters mocha junit --coverage'
  buildNode = 'jenkins-slave-all-test'
}


