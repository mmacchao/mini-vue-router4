function createCurrentLocation(base) {
    if(base.includes('#')) return !base.slice(1) ? '/' : base.slice(1)
    const {pathname, search, hash} = window.location
    return pathname + search + hash
}
function buildState(back, current, forward, replace = false, computedScroll = false) {
    return {
        back,
        current,
        forward,
        replace,
        scroll: computedScroll ? {left: window.pageXOffset, top: window.pageYOffset} : null,
        position: window.history.length - 1
    }

}
function useHistoryStateNavigation(base) {
    const currentLocation = {
        value: createCurrentLocation(base)
    }
    const historyState = {
        value: window.history.state
    }
    if(!historyState.value) {
        // historyState.value = buildState(null, currentLocation.value, null, true, false)
        changeLocation(currentLocation.value, buildState(null, currentLocation.value, null, true, false), true)
    }

    function changeLocation(to, state, replace) {
        const url = base ? base + to : to
        window.history[replace ? 'replaceState' : 'pushState'](state, null, url)
        historyState.value = state
    }
    function push(to, state) {
        // 跳转前更新状态
        const currentState = {
            ...historyState.value,
            forward: to,
            scroll: {left: window.pageXOffset, top: window.pageYOffset}
        }
        // 更新旧状态
        changeLocation(currentState.current, currentState, true)
        const newState = {
            ...buildState(currentLocation.value, to, null),
            position: currentState.position+1,
            ...state,
        }
        // 添加新状态
        changeLocation(to, newState, false)
        currentLocation.value = to
        
    }

    function replace(to, state) {
        const newState = {
            ...buildState(historyState.value.back, to, historyState.value.forward, true),
            ...state,
        }
        changeLocation(to, newState, true)
        currentLocation.value = to
    }


    return {
        push,
        replace,
        location: currentLocation,
        state: historyState,
    }
}

function useHistoryListeners(historyState, currentLocation) {
    const listens = []
    const popStateHandler = ({state}) => {
        const to = createCurrentLocation(window.location.hash)
        const from = currentLocation.value
        const fromState = historyState.value

        currentLocation.value = to
        historyState.value = state
        let isBack = state.position - fromState.position < 0

        listens.forEach(cb => {
            cb(to, from, {isBack})
        })

    }
    window.addEventListener('popstate', popStateHandler)

    function listen(cb) {
        listens.push(cb)
    }

    return {
        listen
    }
}

export function createWebHistory(base) {
    const historyNavigation = useHistoryStateNavigation(base)
    const historyListeners = useHistoryListeners(historyNavigation.state, historyNavigation.location)
    const routerHistory = {
        ...historyListeners,
        ...historyNavigation
    }
    Object.defineProperty(routerHistory, 'historyState', {
        get: () => routerHistory.state.value
    })
    Object.defineProperty(routerHistory, 'currentLocation', {
        get: () => routerHistory.location.value
    })
    return routerHistory
}
