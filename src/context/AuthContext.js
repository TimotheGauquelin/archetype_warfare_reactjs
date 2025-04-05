const { createContext } = require("react");

const AuthContext = createContext({
    authUser: {
        // isAuthenticated: false,
        // id: null,
        // username: null,
        // email: null,
        // roles: null,
        // token: null
    },
    setAuthUser: () => { },
})

export default AuthContext;