import {v1} from "uuid"
import {
    addTodoListAC, changeEntityStatusAC,
    changeFilterTodoListAC,
    changeTitleTodoListAC, Filter,
    removeTodoListAC, setTodoListsAC, TodolistDomainType,
    todolistReducer
} from "./todolist-reducer"
import {taskReducer, TasksType} from "./task-reducer"
import {TaskPriorities, TaskStatuses} from "../../api/tasks-api"
import {StatusType} from "../../app/app-reducer"

let state: TodolistDomainType[]
let state2: TasksType
const todoList1: string = v1()
const todoList2: string = v1()
const title: string = "newTodo"
const filter: Filter = "Active"
const entityStatus: StatusType = "loading"

const task1: string = v1()
const task2: string = v1()

beforeEach(() => {
    state = [
        {
            id: todoList1,
            title: "todo 1",
            filter: "All",
            addedDate: "",
            order: 0,
            entityStatus: "idle"
        },
        {
            id: todoList2,
            title: "todo 2",
            filter: "All",
            addedDate: "",
            order: 0,
            entityStatus: "idle"
        }
    ]

    state2 = {
        [todoList1]: [
            {
                id: v1(),
                title: "1HTML&CSS",
                status: TaskStatuses.New,
                description: "description",
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList1,
                order: 0,
                addedDate: "",
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.Completed,
                description: "description",
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList1,
                order: 0,
                addedDate: "",
            },
            {
                id: task2,
                title: "ReactJS",
                status: TaskStatuses.New,
                description: "description",
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList1,
                order: 0,
                addedDate: "",
            }
        ],
        [todoList2]: [
            {
                id: task1,
                title: "book",
                status: TaskStatuses.New,
                description: "description",
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList2,
                order: 0,
                addedDate: "",
            },
            {
                id: v1(),
                title: "milk",
                status: TaskStatuses.Completed,
                description: "description",
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                todoListId: todoList2,
                order: 0,
                addedDate: "",
            },
        ]
    }
})

test("remove TodoList", () => {
    const action = removeTodoListAC(todoList1)

    const result: TodolistDomainType[] = todolistReducer(state, action)
    const result2: TasksType = taskReducer(state2, action)

    expect(result.length).toBe(1)
    expect(result[0].id).toBe(todoList2)

    expect(result2[todoList1]).toBeUndefined()
})

test("add TodoList", () => {

    const newTodolist: TodolistDomainType = {id: v1(), title: title, filter: "All", addedDate: "", order: 0, entityStatus: "idle"} as const

    const action = addTodoListAC(newTodolist)

    const result: TodolistDomainType[] = todolistReducer(state, action)
    const result2: TasksType = taskReducer(state2, action)

    expect(result.length).toBe(3)
    expect(result[0].title).toBe(title)
    expect(result[0].filter).toBe("All")

    const keys = Object.keys(result2)
    const newKey = keys.find(k => k != todoList1 && k != todoList2)
    if(!newKey) throw Error("new key should be added")

    expect(keys.length).toBe(3)
    expect(result2[newKey]).toEqual([])

    expect(result[0].id).toBe(newTodolist.id)
    expect(keys[2]).toBe(newTodolist.id)
})

test("change Title TodoList", () => {
    const result: TodolistDomainType[] = todolistReducer(state, changeTitleTodoListAC(todoList2, title))

    expect(result.length).toBe(2)
    expect(result[1].title).toBe(title)
})

test("change EntityStatus TodoList", () => {
    const result: TodolistDomainType[] = todolistReducer(state, changeEntityStatusAC(todoList2, entityStatus))

    expect(result.length).toBe(2)
    expect(result[1].entityStatus).toBe(entityStatus)
})

test("change Filter TodoList", () => {
    const result: TodolistDomainType[] = todolistReducer(state, changeFilterTodoListAC(todoList1, filter))

    expect(result.length).toBe(2)
    expect(result[0].filter).toBe(filter)
})

test("set TodoLists", () => {

    const result: TodolistDomainType[] = todolistReducer([], setTodoListsAC(state))

    expect(result.length).toBe(2)
    expect(result[0].filter).toBe("All")
    expect(result[0].id).toBe(todoList1)
    expect(result[3]).toBeUndefined()
})

test("set TodoLists and tasks", () => {

    const endState = taskReducer({}, setTodoListsAC(state))
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState[todoList1]).toBeDefined()
    expect(endState[todoList2]).toBeDefined()
})


/*test("test WRONG ACTION", () => {
    expect(() => {
        todolistReducer(state, {type: "WRONG ACTION"})
    }).toThrow()
})*/
