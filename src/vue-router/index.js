export * from './history/hash'
export * from './history/html5'

function normalizeRouteRecord(record) {
    return {
        path: record.path,
        meta: record.meta || {},
        beforeEnter: record.beforeEnter,
        name: record.name,
        components: {
            default: record.component,
        },
        children: record.children || [],
    }
}

function createRouteRecordMatcher(record, parent) {
    const matcher = {
        path: parent?.path ? parent.path + record.path : record.path,
        record,
        parent,
        children: []
    }
    if(parent) {
        parent.children.push(matcher)
    }
    return matcher
}

function createRouterMatcher(routes) {
    const matchers = []
    function addRoute(route, parent) {
        let normalizeRecord = normalizeRouteRecord(route)
        const matcher = createRouteRecordMatcher(normalizeRecord, parent)
        if(normalizeRecord.children) {
            normalizeRecord.children.forEach(item => addRoute(item, matcher))
        }
        matchers.push(matcher)
    }

    routes.forEach(route => addRoute(route, null))
    return {
        addRoute
    }
}

export function createRouter(options) {
    const { history: routerHistory, routes } = options
    const matcher = createRouterMatcher(routes)
    // console.log(matcher)
    const router = {
        install(app) {
            app.component('RouterLink', {
                props: {
                    to: String,
                },
                setup: (props, { slots }) => {
                    return () => <a href={props.to}>{slots.default && slots.default()}</a>
                }
            })
            app.component('RouterView', {
                setup: (props, { slots }) => {
                    return () => <div>  </div>
                }
            })

        }
    }

    return router
}