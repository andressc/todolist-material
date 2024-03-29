import {AddTodoListType, ClearTodoListsType, RemoveTodoListType, SetTodoListsType} from "./todolist-reducer"
import {TaskPriorities, tasksApi, TaskStatuses, TaskType} from "../../api/tasks-api"
import {AppThunk} from "../../app/store"
import {setStatusAC} from "../../app/app-reducer"
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils"

export type TasksActionsType =
    AddTaskType
    | RemoveTaskType
    | ChangeStatusTaskType
    | AddTodoListType
    | RemoveTodoListType
    | SetTodoListsType
    | SetTaskType
    | ClearTodoListsType

const initialState: TasksType = {}

export type TasksType = {
    [key: string]: TaskType[]
}

type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const taskReducer = (state: TasksType = initialState, action: TasksActionsType): TasksType => {
    switch (action.type) {
        case "ADD-TASK":
            return {...state, [action.newTask.todoListId]: [...state[action.newTask.todoListId], action.newTask]}
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(task => task.id !== action.taskId)
            }
        case "CHANGE-TASK":
            const newTasks: TaskType[] = state[action.todoListId]
                .map(task => task.id === action.taskId ? {...task, ...action.model} : task)

            return {...state, [action.todoListId]: newTasks}

        case "ADD-TODO-LIST":
            return {...state, [action.newTodoList.id]: []}

        case "SET-TODO-LISTS":
            const copyState = {...state}
            action.todoLists.forEach(tl => copyState[tl.id] = [])

            return copyState

        case "SET-TASKS":
            return {...state, [action.todoListId]: action.tasks}

        case "REMOVE-TODO-LIST": //mutation!!!
            delete state[action.todoListId]
            return {...state}

        case "CLEAR-TODO-LISTS":
            return {}

        default:
            return state
    }
}

type AddTaskType = ReturnType<typeof addTaskAC>
export const addTaskAC = (newTask: TaskType) =>
    ({type: "ADD-TASK", newTask} as const)

type RemoveTaskType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todoListId: string, taskId: string) =>
    ({type: "REMOVE-TASK", todoListId, taskId} as const)

type ChangeStatusTaskType = ReturnType<typeof changeTaskAC>
export const changeTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskType) =>
    ({type: "CHANGE-TASK", todoListId, taskId, model} as const)

type SetTaskType = ReturnType<typeof setTaskAC>
export const setTaskAC = (tasks: TaskType[], todoListId: string,) =>
    ({type: "SET-TASKS", tasks, todoListId} as const)


export const fetchTasksTC = (id: string): AppThunk => dispatch => {
    dispatch(setStatusAC("loading"))

    tasksApi.getTasks(id).then(response => {
        dispatch(setTaskAC(response.data.items, id))
        dispatch(setStatusAC("succeeded"))
    })
}

export const updateTaskTC = (todoListId: string, taskId: string, model: UpdateDomainTaskType): AppThunk => (dispatch, getState) => {

    dispatch(setStatusAC("loading"))

    const state = getState()
    const task = state.tasks[todoListId].find(t => t.id === taskId)

    if (!task) throw new Error("task not found where updating title")

    const updatedTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...model
    }

    tasksApi.updateTask(todoListId, taskId, updatedTask)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTaskAC(todoListId, taskId, model))
                dispatch(setStatusAC("succeeded"))
                return
            }

            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })
}

export const removeTaskTC = (todoListId: string, taskId: string): AppThunk => dispatch => {

    tasksApi.deleteTask(todoListId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) dispatch(removeTaskAC(todoListId, taskId))
        })
}

export const addTaskTC = (todoListId: string, title: string): AppThunk => async dispatch => {

    dispatch(setStatusAC("loading"))
    tasksApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setStatusAC("succeeded"))
                return
            }

            handleServerAppError(res.data, dispatch)
        })
        .catch(error => {
            handleServerNetworkError(dispatch, error)
        })


    /*dispatch(setStatusAC("loading"))

    const result = await tasksApi.createTask(todoListId, title)
    if (result.data.resultCode === 0) {
        dispatch(addTaskAC(result.data.data.item))
        dispatch(setStatusAC("succeeded"))
        return
    }

    if (result.data.messages.length) {
        dispatch(setErrorAC(result.data.messages[0]))
        dispatch(setStatusAC("failed"))
        return
    }

    dispatch(setErrorAC("some Error"))
    dispatch(setStatusAC("failed"))*/
}