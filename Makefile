IMAGE_NAME = email-scheduler-api

CONTAINER_NAME = email-scheduler-api

TAG_NAME = santhoshgugan/email-scheduler-api

deploy-local:
	docker build -t ${TAG_NAME}:${TAG_NAME} .
	docker stop ${CONTAINER_NAME} || true
	docker rm ${CONTAINER_NAME} || true
	docker run --name ${TAG_NAME} -e NODE_ENV=local -p 3000:3000


deploy-dev:
	sudo docker build -t ${IMAGE_NAME} .
	sudo docker stop ${CONTAINER_NAME} || true
	sudo docker rm ${CONTAINER_NAME} || true
	sudo docker run --name ${CONTAINER_NAME} --add-host host.docker.internal:host-gateway -e NODE_ENV=dev -p 3000:3000 -d ${IMAGE_NAME} 

build:
	docker-compose build

up:
	docker-compose up

down:
	docker-compose down
