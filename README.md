# image-resizing-service
Node Image resizing service

## Run outside of docker containers

1. Install redis (Below installation with brew example).
   `$ brew update`
   `$ brew install redis`

2. Clone this repository on your computer
3. Run `npm install`
4. First set `current_env` property in `config.js` to DEV (This is pretty ugly, needs to be fixed asap)
5. Open a terminal and run redis-server
6. Run `npm start`
  
## Run outside of docker containers

1. First set `current_env` property in config.js to PROD (default value is PROD)
2. Run `docker-compose up`

## a short summary page is available on http://3000/ in the browser

## Implementation

- Worker Queue design with Redis (used by **bull**) for storing resizing tasks
- Basic design :
  1. Url matcher to get resizing request parameters
  2. ResizingJobManager (which manages job posts and distribution to workers). Tasks metadata (width, height, format ...) are stored in a redis queue which tasks are retrieved by available workers
  3. ResizingJob which performs the resizing with **sharp** (seemed faster than other libraries)
  4. Callback repository to store callback to be called by workers once job is done.
  5. Basic log with standard output (Did not make it in time to use **morgan**)

## Things to be improved first

- Change this PROD DEV system : this should be done automatically with the docker_compose
- Update urlmatcher system to accept more urls than it does currently (some cases not handled)
- Logging to implement (only std out used here)
- Callback storage not optimal solution
- Handle concurrency with bull (is not handled yet)
- Add more UT (only implemented for ResizingJob module)
- Write some script to deploy on some machine

## Not handled edge cases
- Consecutive calls for uncached same request
- High throughput (concurrency settings not handled yet with bull)

## Monitoring
- Some logs have been introduced, but only standard output. To improve monitoring **morgan** should be used
- To monitor the service, one way would be to store logs on **AWS** and for example link them to some tool like **KIBANA** coupled with cloudwatch
