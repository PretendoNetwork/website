# syntax=docker/dockerfile:1

ARG app_dir="/home/node/app"


# * Base Node.js image
FROM node:22-alpine AS base
ARG app_dir
WORKDIR ${app_dir}


# * Installing production dependencies
FROM base AS dependencies

RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/root/.npm \
	npm ci --omit=dev


# * Installing development dependencies and building the application
FROM base AS build

RUN --mount=type=bind,source=package.json,target=package.json \
	--mount=type=bind,source=package-lock.json,target=package-lock.json \
	--mount=type=cache,target=/root/.npm \
	npm ci

COPY . .

RUN npm run build


# * Running the final application
FROM base AS final
ARG app_dir

USER node
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080
EXPOSE 8080

COPY package.json .

COPY --from=dependencies ${app_dir}/node_modules ${app_dir}/node_modules
COPY --from=build ${app_dir}/.output ${app_dir}/.output

CMD ["node", "--enable-source-maps", ".output/server/index.mjs"]
