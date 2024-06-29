FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install --force
RUN npm run build

# You'll probably want to remove this in production, it's here to make it easier to test things!
EXPOSE 4000
EXPOSE 8081
CMD ["npm", "run", "start"]
