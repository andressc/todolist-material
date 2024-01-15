import {applyMiddleware, combineReducers, legacy_createStore} from "redux"
import {todolistReducer, TodoListsActionsType} from "../features/TodoListsList/todolist-reducer"
import {taskReducer, TasksActionsType} from "../features/TodoListsList/task-reducer"
import {composeWithDevTools} from "@redux-devtools/extension"
import {thunk, ThunkAction, ThunkDispatch} from "redux-thunk"
import {AppActionsType, appReducer} from "./app-reducer"

const rootReducer = combineReducers({
    todoLists: todolistReducer,
    tasks: taskReducer,
    app: appReducer
})

export type AppRootState = ReturnType<typeof rootReducer>
export type ApplicationActionsType = TodoListsActionsType | TasksActionsType | AppActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, ApplicationActionsType>
export type AppDispatch = ThunkDispatch<AppRootState, unknown, ApplicationActionsType>
export const store = legacy_createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

store.subscribe(() => {
    console.log("state changed")
})