# Running BMI Microservices Project on VirtualBox VM with Local Jenkins and KIND Cluster

This guide explains how to set up and run the BMI microservices project on a VirtualBox VM, using local Jenkins for CI/CD and KIND for Kubernetes.

---

## Prerequisites
- VirtualBox installed on your host machine
- Ubuntu (or similar Linux) VM created in VirtualBox
- VM has at least 4GB RAM, 2 CPUs, and internet access
- Docker installed in the VM
- KIND installed in the VM
- kubectl installed in the VM
- Java 17+, Node.js 18+, Maven, npm installed in the VM
- Jenkins installed and running in the VM (can use Docker)

---

## 1. Prepare the VM
- Install Ubuntu (or similar) in VirtualBox
- Enable network (NAT or Bridged for internet access)
- Update and install dependencies:
```
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-17-jdk maven nodejs npm docker.io git curl
```
- Add your user to the docker group:
```
sudo usermod -aG docker $USER
newgrp docker
```

---

## 2. Install KIND and kubectl
```
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.23.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

---

## 3. Install Jenkins (Docker method recommended)
```
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```
- Access Jenkins at `http://<VM-IP>:8080` from your host browser.
- Complete setup and install recommended plugins.

---

## 4. Clone the Project in the VM
```
git clone <your-repo-url>
cd myWebSite
```

---

## 5. Build and Load Docker Images
```
mvn clean package -DskipTests
cd frontend && npm install && npm run build && cd ..
docker build -t bmi-backend:latest .
docker build -t bmi-frontend:latest ./frontend
kind load docker-image bmi-backend:latest --name kind
kind load docker-image bmi-frontend:latest --name kind
```

---

## 6. Create KIND Cluster
```
kind create cluster --name kind
```

---

## 7. Deploy Kubernetes Manifests
- Edit `k8s/mysql-secret.yaml` with your MySQL username and password.
- Edit `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml` to use local image names (no registry prefix).

```
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-statefulset.yaml
kubectl apply -f k8s/service-mysql.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/service-backend.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/service-frontend.yaml
```

---

## 8. Access the Application
- Forward frontend service:
```
kubectl port-forward svc/bmi-frontend-service 3000:80
```
- Open [http://localhost:3000](http://localhost:3000) in your VM browser or use the VM's IP from your host.

---

## 9. Configure Jenkins Pipeline
- Use the provided `cicd/Jenkinsfile` in your Jenkins job.
- Set up credentials for DockerHub, Artifactory, and Vault as needed.
- Add build steps to run the shell script `cicd/update_build_number.sh` and the Ansible playbook `cicd/ansible_deploy.yml` if desired.

---

## 10. Cleanup
```
kind delete cluster --name kind
docker stop jenkins && docker rm jenkins
```

---

## Notes
- KIND does not support LoadBalancer services by default. Use `kubectl port-forward` for local access.
- For persistent MySQL data, configure a local PersistentVolume or use hostPath.
- For troubleshooting, use `kubectl get pods`, `kubectl logs <pod>`, and `kubectl describe <resource>`.
- You can snapshot your VM for easy rollback.
