FROM node:18-alpine

# setup
WORKDIR /code
COPY ./server/ ./server/
COPY ./shared/ ./shared/
COPY ./webui/ ./webui/

# build server 
RUN mkdir /dist
WORKDIR /code/server
RUN rm -rf ./node_modules ./dist
RUN npm install
RUN npm run build
RUN mv ./dist/* /dist
RUN mv ./node_modules /dist/

# # build UI
RUN mkdir /dist/webui
WORKDIR /code/webui
RUN rm -rf ./node_modules ./dist
RUN npm install
RUN npm run build
RUN mv ./dist/* /dist/webui

# # cleanup
RUN rm -rf /code

EXPOSE 20600

CMD ["node", "/dist/server/src/main"]
