pipeline {
  agent any

  tools {
    nodejs 'NodeJS'   // change if your Jenkins NodeJS tool has a different name
  }

  environment {
    EC2_USER = 'ubuntu'
    EC2_HOST = 'EC2_PUBLIC_IP_OR_DNS'   // replace later when you deploy
    REMOTE_PATH = '/home/ubuntu/app'
    SSH_CRED_ID = 'ec2-ssh-key'         // set this in Jenkins if/when you add SSH creds
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Package') {
      steps {
        sh 'tar -czf app.tar.gz package.json index.js node_modules || true'
        archiveArtifacts artifacts: 'app.tar.gz', onlyIfSuccessful: true
      }
    }

    stage('Deploy to EC2 (optional)') {
      when { expression { return false } } // change to true when ready
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CRED_ID, keyFileVariable: 'KEYFILE', usernameVariable: 'SSH_USER')]) {
          sh """
            scp -o StrictHostKeyChecking=no -i ${KEYFILE} app.tar.gz ${EC2_USER}@${EC2_HOST}:/tmp/
            ssh -o StrictHostKeyChecking=no -i ${KEYFILE} ${EC2_USER}@${EC2_HOST} \\
              'mkdir -p ${REMOTE_PATH} && tar -xzf /tmp/app.tar.gz -C ${REMOTE_PATH} && cd ${REMOTE_PATH} && npm install --production && pm2 restart app || pm2 start index.js --name app'
          """
        }
      }
    }
  }

  post {
    always {
      echo "Pipeline finished. Check console output and archived artifacts."
    }
  }
}
